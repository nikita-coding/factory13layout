import { Fancybox } from "@fancyapps/ui";
import "./jquery.maskedinput.min";

Fancybox.defaults.infinite = 0;
Fancybox.defaults.Hash = false;
Fancybox.defaults.dragToClose = false;

jQuery(document).ready(($) => {
    $(".js-phone").mask("+7 (999) 999-99-99");
});

document.querySelectorAll("[data-scroll]").forEach(item => {
    item.onclick = () => {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(item.dataset.scroll).offset().top
        }, 1000);
    }
});
