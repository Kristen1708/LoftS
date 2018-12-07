/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    function sortTowns(a, b) {
        if (a.name > b.name) {

            return 1;
        } else if (a.name < b.name) {

            return -1;
        }

        return 0;
    }

    return fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
        .then(response => response.json())
        .then(towns => towns.sort(sortTowns));
}


/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */

function isMatching(full, chunk) {
    return (new RegExp(chunk, 'i')).test(full);
}

function filterTowns(towns, filterValue) {
    return filterValue !== '' ? towns.filter(town => isMatching(town.name, filterValue)) : [];
}

function displayFilteredTowns(filteredTowns) {
    let townsListHTML = '';
    for (let town of filteredTowns) {
        townsListHTML += `${town.name}<br>`;
    }
    filterResult.innerHTML = townsListHTML;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let townsList = [];

main();

filterInput.addEventListener('keyup', function () {
    // это обработчик нажатия клавиш в текстовом поле
    const filteredTowns = filterTowns(townsList, filterInput.value);

    displayFilteredTowns(filteredTowns);
});

function main() {
    loadTowns()
        .then(towns => {
            townsList = towns;
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';
            let retryButton = document.querySelector('#retry-btn');
            if (retryButton) {
                retryButton.remove();
            }
        })
        .catch(error => {
            console.log(error.message);
            loadingBlock.textContent = 'Не удалось загрузить города';
            let retryButton = document.querySelector('#retry-btn');
            if (!retryButton) {
                retryButton = document.createElement('button');
                retryButton.textContent = 'Повторить';
                retryButton.id = 'retry-btn';
                homeworkContainer.appendChild(retryButton);
                retryButton.addEventListener('click', main);
            }
        });
}

export {
    loadTowns,
    isMatching
};
