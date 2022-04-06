import { Fancybox } from "@fancyapps/ui";
import "./jquery.maskedinput.min";

Fancybox.defaults.infinite = 0;
Fancybox.defaults.Hash = false;
Fancybox.defaults.dragToClose = false;

jQuery(document).ready(($) => {
    $(".js-phone").mask("+7 (999) 999-99-99");

    $(".faq__question").click(function(e) {
        $(this).toggleClass("faq__question_active")
        $(this).siblings(".faq__answer").slideToggle();
    });

    $(".history__read-more").click(function () {
        $(this).fadeOut(50);
        $(".history__more-text").slideDown(200);
    });

    $("#project_file_input").change(function (e) {
        $(this).siblings(".file-project-input__file-plus").hide();
        $(this).siblings(".file-project-input__file-doc").show();
        $(this).siblings(".file-project-input__file-label").text($(this).val().replace(/C:\\fakepath\\/i, ''));
    });
});

document.querySelectorAll("[data-scroll]").forEach(item => {
    item.onclick = () => {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(item.dataset.scroll).offset().top
        }, 1000);
    }
});
