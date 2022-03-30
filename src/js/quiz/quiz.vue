<template lang="pug">
	.container
		include ../../pages/_mixins
		form(action="/thanks/" method="post" enctype="multipart/form-data")
			input(type="hidden" name="form-name" value="Квиз")

			.quiz-section__header
				.title-block.title-block_left.quiz-section__left
					.title-block__title Ответьте на&nbsp;3 простых вопроса и
						.text-gold &nbsp;получите расчет стоимости
						|  в&nbsp;течение рабочего дня

				.quiz-section__right
					.quiz-section__dir(v-if="step === 1 || step === 2")
						+assets_img("quiz-dir-photo", "png")

						.quiz-section__dir-quote(v-if="step === 1") «Я лично отвечаю за&nbsp;качество и&nbsp;сроки по каждому заказу.»
						.quiz-section__dir-quote.quiz-section__dir-quote_step2(v-if="step === 2") «Рекомендуем своим клиентам Эггер, чтобы быть уверенными в качестве»
						.quiz-section__dir-name Кочнев Илья Дмитриевич
							br
							strong Основатель компании

					.quiz-section__photo(v-if="step === 3 && !form")
						+assets_img("quiz-3-photo", "jpg")
						.quiz-section__photo-description Так выглядит упаковка вашего заказа

					.quiz-section__photo(v-if="form")
						+assets_img("quiz-4-photo", "jpg")
						.quiz-section__photo-description Менеджер по работе с клиентами

				.quiz-section__quote(v-if="form") «Я уже начал расчет по вашему заказу»
			.quiz
				.quiz__steps
					.quiz__step(
						v-for="stepsItem in steps"
						:class="{ 'quiz__step_done' : stepsItem <= step }"
						) {{ stepsItem }}

				.quiz__left(v-show="!form")
					.quiz__step-question.quiz__step-question_1(v-show="step === 1")
						.quiz__title Приложите эскиз от руки или&nbsp;модель в программе «Базис»

						label.quiz__file(for="quiz_file_input")
							input.hidden(type="file" name="file" id="quiz_file_input" @change="processFile($event)")
							.quiz__file-plus(v-if="!file")
								.quiz__file-plus-icon +
							.quiz__file-doc(v-else)
							.quiz__file-label(v-if="!file") Если у вас только эскиз, наш&nbsp;технолог разработает по&nbsp;нему модель
							.quiz__file-label(v-else) {{ file }}

					.quiz__step-question.quiz__step-question_2(v-show="step === 2")
						.quiz__title Какой ЛДСП будет использоваться?

						.quiz__arrow.quiz__arrow_2

						.quiz__select-items
							.quiz__select-item(v-for="(item, key) in ldspItems")
								input(:id="'ldsp_item_'+key" type="radio" name="ldsp" :value="item" v-model="ldspSelected")
								label(:for="'ldsp_item_'+key") {{ item }}

					.quiz__step-question.quiz__step-question_3(v-show="step === 3")
						.quiz__title Вам нужна надежная упаковка?

						.quiz__arrow.quiz__arrow_3

						.quiz__select-items2
							.quiz__select-item2
								input(id="pack1" type="radio" name="pack" value="Да" checked)
								label(for="pack1") Да
							.quiz__select-item2
								input(id="pack2" type="radio" name="pack" value="Нет")
								label(for="pack2") Нет

						.quiz__pack-details.quiz__text
							div Трехслойный гофрокартон + обрезки ЛДСП.
							div Чтобы детали не ездили и не скользили в упаковке, их обкладывают.
							div
								.text-gold Тогда изделия приедут в целости и сохранности.


					.quiz__buttons(:class="'quiz__buttons_step-' + step")
						.button.quiz__back-button.button_faded(@click="prevStep" v-if="step > 1") Назад
						.button(@click="nextStep" v-if="step === 1 && !file") У меня нет
						.button(@click="nextStep" v-if="step !== 1 || (step === 1 && file)") Далее

				.quiz__left(v-show="form")
					.quiz__step-question.quiz__step-question_form
						.quiz__title Мы уже начали считать

						.quiz__arrow.quiz__arrow_form

						.quiz__text.quiz__form-text
							div Просто оставьте свой номер, чтобы мы смогли отправить расчет стоимости и сроков.
							div
								.text-gold За номером будет закреплена стоимость и спец. условия.

						input.quiz__phone-input.js-phone(type="text" name="phone" placeholder="Ваш номер телефона" required)

						.quiz__submit-button
							button.button.button_xl.button_w100 Получить расчет + сроки

						.quiz__select-item.quiz__select-item_checkbox.quiz__pk
							input(id="quiz_pk" type="checkbox" name="checkbox" value="pk" checked)
							label(for="quiz_pk")
								div Нажимая на кнопку, вы соглашаетесь c&nbsp;
									a(href="/policy/" target="_blank") политикой конфиденциальности

				.quiz__vertical-separator
				.quiz__right
					.quiz__form-lock(v-if="form")
					.quiz__questions-yet(:class="{'quiz__questions-yet_hidden': form}")
						div(v-if="step === 1") Осталось 2 вопроса
						div(v-else-if="step === 2") Остался 1 вопрос
						div(v-else-if="step === 3") Последний шаг
						div(v-else) &nbsp;
					.quiz__in-the-end
						.quiz__in-the-end-you(v-if="form") Сейчас вы:
						.quiz__in-the-end-you(v-else) В конце теста вы:
						.quiz__in-the-end-items
							.quiz__in-the-end-item — Получите расчет стоимости
							.quiz__in-the-end-item — Узнаете сроки изготовления
							.quiz__in-the-end-item — Получите бесплатную консультацию со специалистом
</template>
<script>
export default {
	data: () => ({
		step: 1,
		steps: [1, 2, 3],
		ldspItems: [
			"Эггер",
			"Ламарти",
			"Увадрев",
			"Кроношпан",
			"Томлесдрев",
			"МДФ в материале",
			"Другое",
		],
		ldspSelected: "Эггер",
		form: false,
		file: null,
	}),
	methods: {
		nextStep() {
			if(this.step < 3) this.step++;
			else this.form = true;
		},
		prevStep() {
			if(this.step > 1) this.step--;
		},
		processFile(event) {
			this.file = event.target.files[0].name;
		}
	},
}
</script>