"use strict";

function showModal() {
    $(".modal-wrap").removeClass("hide");
    $(document).keydown(function (event) {
        if (event.keyCode == 27) closeModal();
    });
};

function closeModal() {
    $('.modal-wrap').addClass('hide');
    document.onkeydown = null;
    $(".table-modal").empty();
}

$(".modal-project-icon").click(closeModal);
$(".modal-project-close").click(closeModal);