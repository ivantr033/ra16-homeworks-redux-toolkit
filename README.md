# Домашнее задание к блоку «Redux Toolkit» — Задача «Поиск фильмов»

Веб-приложение для поиска фильмов и сериалов через OMDb API, просмотра подробной информации и управления списком избранного, разработанное на React 19, TypeScript 5 и Redux Toolkit.

[![Build Status](https://github.com/ivantr033/ra16-homeworks-redux-toolkit/actions/workflows/deploy.yml/badge.svg)](https://github.com/ivantr033/ra16-homeworks-redux-toolkit/actions/workflows/deploy.yml)

## 🌐 Ссылка на развертывание (GitHub Pages)

* **Movie Search App:** [Открыть приложение](https://ivantr033.github.io/ra16-homeworks-redux-toolkit/)

## ⚙️ Реализованные требования и технические характеристики

### Основная функциональность

1. **Архитектура Redux Toolkit:** Состояние разделено на модульные слайсы (`moviesSlice`, `favoritesSlice`, `uiSlice`) с использованием `configureStore`, `createSlice` и `createAsyncThunk` для асинхронных запросов к OMDb API.
2. **Навигация (React Router):** Реализованы маршруты главной страницы поиска (`/`), детальной страницы фильма (`/movie/:id`) и раздела избранного (`/favorites`).
3. **Синхронизация с `localStorage` через Middleware:** Пользовательский middleware автоматически сохраняет список избранных фильмов, историю поисковых запросов и выбранную тему оформления.
4. **Обработка состояний и UI/UX:** Реализованы дебаунс-поиск (500 мс), скелетоны карточек и спиннеры при загрузке, а также универсальный компонент `ErrorAlert` для отображения сетевых ошибок и ошибок API.

### Дополнительные задачи (выполнены полностью)

* **Пагинация и фильтрация:** Постраничная навигация по результатам поиска OMDb API и фильтрация по типу контента (`movie`, `series`, `episode`).
* **Сортировка и селекторы:** Мемоизированный селектор `selectSortedSearchResults` для сортировки результатов по году выпуска и названию.
* **История поиска и оффлайн-кеширование:** Сохранение последних поисковых запросов с возможностью быстрого повтора и кеширование ответов API в `localStorage` для работы в оффлайн-режиме.
* **Шеринг и тема оформления:** Копирование прямой ссылки на карточку фильма в буфер обмена с всплывающим уведомлением и переключатель светлой/тёмной темы.

## 🛠️ Технологический стек

* **Фронтенд:** React 19 (Функциональные компоненты, Хуки `useState`, `useEffect`)
* **Управление состоянием:** Redux Toolkit (`createSlice`, `createAsyncThunk`, `createSelector`, custom `Middleware`), React-Redux
* **Маршрутизация:** React Router DOM (`HashRouter`, `Routes`, `NavLink`)
* **Язык:** TypeScript 5 (Строгая типизация моделей API, слайсов и селекторов)
* **Сборщик:** Vite
* **CI/CD:** GitHub Actions (автоматическая сборка и деплой на ветку `gh-pages`)

## 🔧 Инструкция по установке и запуску

1. Клонируйте репозиторий и перейдите в папку проекта:

   ```bash
   git clone https://github.com/ivantr033/ra16-homeworks-redux-toolkit
   cd ra16-homeworks-redux-toolkit
   ```

2. Установите зависимости:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Запустите проект в режиме разработки:

   ```bash
   npm run dev
   ```

   Приложение откроется локально по адресу `http://localhost:5173`.

4. Для создания production-сборки выполните:

   ```bash
   npm run build
   ```
