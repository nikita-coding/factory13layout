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
        $(this).fadeOut(50, () => {
            $(".history__more-text").show();
            document.querySelector(".history__panel-bg").innerHTML += "";
        });

    });

    $("#project_file_input").change(function (e) {
        $(this).siblings(".file-project-input__file-plus").hide();
        $(this).siblings(".file-project-input__file-doc").show();
        $(this).siblings(".file-project-input__file-label").text($(this).val().replace(/C:\\fakepath\\/i, ''));
    });

    $("input[name='accept']").each((key, elem) => {
        $(elem).prop('checked', false);
    });

    $("#page_missing_form").submit((e) => {
        e.preventDefault();
        $.ajax({
            url: "/thanks/",
            method: "POST",
            data: {
                "form-name": "Какой информации не хватило на странице",
                "page-missing": $("#page_missing_form textarea[name='page-missing']").val(),
            }
        })
        .done(function() {
            $(".page-missing__form").hide();
            $(".page-missing__thanks").show();
        });
    });

    const triggerBookmark = $(".js-bookmark");
    triggerBookmark.click(function(e) {

        if (window.sidebar && window.sidebar.addPanel) { // Firefox <23

            window.sidebar.addPanel(document.title,window.location.href,'');

        } else if(window.external && ('AddFavorite' in window.external)) { // Internet Explorer

            window.external.AddFavorite(location.href,document.title);

        } else { // Для других браузеров (в основном WebKit) мы используем простое оповещение, чтобы информировать пользователей о том, что они могут добавлять в закладки с помощью ctrl + D / cmd + D

            alert('Вы можете добавить эту страницу в закладки, нажав ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D на клавиатуре.');

        }
        // Если у вас есть что-то в `href` вашего триггера
        return false;
    })
});

document.querySelectorAll("[data-scroll]").forEach(item => {
    item.onclick = () => {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(item.dataset.scroll).offset().top
        }, 1000);
    }
});
