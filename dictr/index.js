"use strict";

$('.btn-getModal').click(function () {
    var url = "https://raw.githubusercontent.com/SkakunD/jsontest/master/" + $(this).data("name") + ".json"; // формируем строку get запроса 
    var $titleTable = "";
    var checkColor = "";
    var $titleBlock = "";
    if ($(this).data("name") == "persons") {
        $titleTable = $("<tr><th>Имя</th><th>Фамилия</th><th>Отчество</th><th>Дата рождения</th></tr>").addClass("worker");
        checkColor = ".worker .checked-cat";
        $titleBlock = $("<p>Сотрудник</p>").addClass("title-block-parag");
    } else if ($(this).data("name") == "positions") {
        $titleTable = $("<tr><th>Должность</th><th>Минимальный возраст</th><th>Максимальный возраст</th></tr>").addClass("position");
        checkColor = ".position .checked-cat";
        $titleBlock = $("<p>Должность</p>").addClass("title-block-parag");
    } else if ($(this).data("name") == "orgs") {
        $titleTable = $("<tr><th>Организация</th><th>Страна</th></tr>").addClass("firm");
        checkColor = ".firm .checked-cat";
        $titleBlock = $("<p>Организация</p>").addClass("title-block-parag");
    } else if ($(this).data("name") == "subs") {
        $titleTable = $("<tr><th>Подразделение</th><th>Организация</th></tr>").addClass("subfirm");
        checkColor = ".subfirm .checked-cat";
        $titleBlock = $("<p>Подразделение</p>").addClass("title-block-parag");
    };

    var tempColor = $(checkColor).attr("class");                                // получение классов для определения присутствия блока
    var colorBack = "";
    if (tempColor != undefined) {
        colorBack = tempColor.split(" ");                                       // если блок есть то формируем массив из его классов
    }

    $.getJSON(url, function (data) {

        if ($titleTable.attr("class") == "worker") {                            // сортировка полученных данных в зависимости от JSON 
            data.sort(function (a, b) {
                var nameA = a.lastname.toLowerCase();
                var nameB = b.lastname.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            data.sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }

        var $result = $("<table></table>");                                                 // создаем таблицу
        $result.append($titleTable);                                                        // добавляем заголовки таблицы
        for (var i = 0; i < data.length; i++) {                                             // перебираем массив объектов и создаем строки
            var row = $("<tr></tr>");
            for (var key in data[i]) {                                                      // наполняем ячейки данными 
                row.attr('id', data[i]['id']);
                row.addClass("rowData");
                row.click(checkedRow);
                if (key != "id") {
                    var rowTd = $("<td>" + data[i][key] + "</td>").addClass('table-td');
                    if (tempColor != undefined) {                                           // выделяем блок который уже присутствует на странице
                        if (row.attr("id") == colorBack[0]) row.addClass("checked-row");
                    }
                    row.append(rowTd);
                }
            }
            $result.append(row);
        }
        $(".title-block-parag").remove();                                                   // очищаем все заголовки страницы
        $(".title-block").append($titleBlock);                                              // добавляем новый заголовок
        $(".table-modal").append($result);
    });
    showModal();                                                                            // показ модального окна с таблицей
});

function checkedRow() {                                                                     // функция выделения строки по клику на любой ячейке
    $(".rowData").removeClass('checked-row');
    $(this).addClass('checked-row');
}

$(".modal-project-ok").click(function () {                                                  // функция обработки по кнопке ОК
    var resultRow = $(".checked-row").find("td");                                           // ищем класс checked-row и выбираем все ячейки
    var titleRowClass = $("tr:first").attr("class");                                        // берем класс первой строки таблицы
    var tempResult = $("<div/>").addClass($(".checked-row").attr("id") + " checked-cat").addClass("col l12"); // создаем блок и присваиваем ему классы
    if ($("tr:first").attr("class") == "position") {                                        // условия выборки данных которые будут отображаться на странице под кнопкой
        for (var i = 0; i < resultRow.length - 2; i++) {
            tempResult.append(resultRow[i].innerHTML + " ");
        }
        tempResult.attr("data-min", resultRow[1].innerHTML);
        tempResult.attr("data-max", resultRow[2].innerHTML);
    } else if ($("tr:first").attr("class") == "worker") {
        for (var _i = 0; _i < resultRow.length - 1; _i++) {
            tempResult.append(resultRow[_i].innerHTML + " ");
        }
        var yearsOld = resultRow[3].innerHTML.split(".");
        var now = new Date();
        var nowYear = now.getFullYear();
        var oldPerson = nowYear - parseInt(yearsOld[2]);
        tempResult.attr("data-now", oldPerson);
    } else {
        for (var _i2 = 0; _i2 < resultRow.length - 1; _i2++) {
            tempResult.append(resultRow[_i2].innerHTML + " ");
        }
    };

    var btnClose = $("<a></a>").attr("data-block", $(".checked-row").attr("id")).addClass("btn-close-link"); // создаем кнопку удаления данных которую поместим после данных на странице
    btnClose.append($("<i></i>").addClass("material-icons btn-close-block").text("close"));
    tempResult.append(btnClose);
    if ($("tr:first").attr("class") == "worker" || $("tr:first").attr("class") == "position") {              // условия проверки двух параметров - сотрудника и должности по возрасту и ограничениям
        if ($("tr:first").attr("class") == "worker") {
            if ($(".position").find(".checked-cat").length == 1) {
                var _yearsOld = resultRow[3].innerHTML.split(".");
                var _now = new Date();
                var _nowYear = _now.getFullYear();
                var _oldPerson = _nowYear - parseInt(_yearsOld[2]);
                if (_oldPerson < $(".position .checked-cat").attr("data-min") || _oldPerson > $(".position .checked-cat").attr("data-max")) {
                    var asked = confirm("Выбранный сотрудник не подходит по возрасту. Вы уверены, что хотите выбрать этого сотрудника?");
                    if (!asked) {
                        return false;
                    };
                }
            }
        } else if ($("tr:first").attr("class") == "position") {
            if ($(".worker").find(".checked-cat").length == 1) {
                var yearsMin = resultRow[1].innerHTML;
                var yearsMax = resultRow[2].innerHTML;
                if (yearsMin > $(".worker .checked-cat").attr("data-now") || yearsMax < $(".worker .checked-cat").attr("data-now")) {
                    var _asked = confirm("Выбранная должность не подходит по возрасту сотруднику. Вы уверены, что хотите выбрать эту должность?");
                    if (!_asked) {
                        return false;
                    };
                }
            }
        }
    }
    closeModal();                                                           // функция закрытия окна
    $("." + titleRowClass + " .checked-cat").remove();                      // очищаем данные на странице и вставляем новые
    $("." + titleRowClass).append(tempResult);

    $(".btn-close-link").click(function () {                                // вешаем обработчик на кнопку (крестик)
        $("." + $(this).attr("data-block")).remove();
    });
});