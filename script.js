const animeForm = document.getElementById("add-anime");
const resetButton = document.getElementById("reset-archive");
const formDialog = document.getElementById("form-dialog");
const formDialogSubmit = document.getElementById("form-dialog-submit");
const formDialogOpen = document.getElementById("form-dialog-open");
const formDialogClose = document.getElementById("form-dialog-close");
const filterSearchApply = document.getElementById("filter-search-apply");
const archiveUrl = "https://webtech.labs.vu.nl/api24/6bf6ff7c";

// if editingId is null, the form will add
// if editingId is an item id, the form will update
let editingId = null;
let yearFilter = null;
let searchFilter = null;
let currentArchive = [];

const sendRequest = async (method, url, data = {}) => {
    return await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

const getArchive = async () => {
    // retrieve everything from the archive (get request to url of archive and return json of that)
    const response = await fetch(archiveUrl);
    return await response.json();
};

const addArchiveItem = async (name, poster, year, genre, description) => {
    // add archive item by sending post to the api
    return await sendRequest("POST", archiveUrl, {
        name,
        poster,
        year,
        genre,
        description,
    });
};

const editArchiveItem = async (
    itemId,
    name,
    poster,
    year,
    genre,
    description
) => {
    // edit an archive item by sending post to the api
    return await sendRequest("PUT", `${archiveUrl}/item/${itemId}`, {
        name,
        poster,
        year,
        genre,
        description,
    });
};

const resetArchive = async () => {
    return await fetch(`${archiveUrl}/reset`);
};

const setYearFilter = (year) => {
    yearFilter = year;
    render();
};

const render = async () => {
    // 1. fetching all the data (we can use getArchive)
    // 2. removing all of the children in the table, grid, and filter DOM
    // 3. repopulate the table, grid, and filter DOM

    // ------ 1 ------
    currentArchive = await getArchive();

    // ------ 2 ------
    const tableElement = document.getElementById("archive-table");
    const archiveGridElement = document.getElementById("archive-grid");
    const filterYearsElement = document.getElementById("filter-years");
    tableElement.replaceChildren();
    archiveGridElement.replaceChildren();
    filterYearsElement.replaceChildren();

    // ------ 3 ------
    let filteredArchive = [...currentArchive];

    if (yearFilter !== null) {
        filteredArchive = filteredArchive.filter(
            (item) => item.year === yearFilter
        );
    }

    if (searchFilter !== null) {
        filteredArchive = filteredArchive.filter(
            (item) =>
                item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                item.genre.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }

    for (const item of filteredArchive) {
        ////////////////////////////////////////////////////////////////////////////
        const rowElement = document.createElement("tr");

        // name column
        const nameColumnElement = document.createElement("td");

        const nameElement = document.createElement("p");
        nameElement.innerHTML = item.name;

        nameColumnElement.appendChild(nameElement);

        const tableEditElement = document.createElement("a");
        tableEditElement.innerHTML = "(edit)";
        tableEditElement.href = `#`;
        tableEditElement.addEventListener("click", (e) => {
            e.preventDefault();
            openEditForm(item.id);
        });

        nameColumnElement.appendChild(tableEditElement);

        rowElement.appendChild(nameColumnElement);

        // img column
        const imgColumnElement = document.createElement("td");
        const figureElement = document.createElement("figure");

        const imgElement = document.createElement("img");
        imgElement.src = item.poster;
        imgElement.alt = item.name;

        figureElement.appendChild(imgElement);

        const figureCaptionElement = document.createElement("figcaption");
        const emTagElement = document.createElement("em");
        emTagElement.innerHTML = item.name;

        figureCaptionElement.appendChild(emTagElement);

        figureElement.appendChild(figureCaptionElement);

        imgColumnElement.appendChild(figureElement);

        rowElement.appendChild(imgColumnElement);

        // year column
        const yearColumnElement = document.createElement("td");
        yearColumnElement.innerHTML = item.year;

        rowElement.appendChild(yearColumnElement);

        // genre column
        const genreColumnElement = document.createElement("td");
        const genreArr = item.genre.split(",").map((genre) => genre.trim());
        const ulElement = document.createElement("ul");

        for (const genre of genreArr) {
            const liElement = document.createElement("li");
            liElement.innerHTML = genre;
            ulElement.appendChild(liElement);
        }

        genreColumnElement.appendChild(ulElement);

        rowElement.appendChild(genreColumnElement);

        // description column
        const descriptionElementColumn = document.createElement("td");
        const descriptionParagraphElement = document.createElement("p");
        descriptionParagraphElement.innerHTML = item.description;

        descriptionElementColumn.appendChild(descriptionParagraphElement);

        rowElement.appendChild(descriptionElementColumn);

        // adding the row to the table
        tableElement.appendChild(rowElement);

        ////////////////////////////////////////////////////////////////////////////

        const gridElement = document.createElement("div");
        gridElement.classList.add("archive-grid");

        // archive image
        const archiveElement = document.createElement("div");
        archiveElement.classList.add("archive-image");

        const imageElement = document.createElement("img");
        imageElement.src = item.poster;
        imageElement.alt = item.name;

        archiveElement.appendChild(imageElement);

        gridElement.appendChild(archiveElement);

        // archive content
        const archiveContentElement = document.createElement("div");
        archiveContentElement.classList.add("archive-content");

        const datePElement = document.createElement("p");
        datePElement.classList.add("archive-year");
        datePElement.innerHTML = item.year;

        archiveContentElement.appendChild(datePElement);

        const titlePElement = document.createElement("p");
        titlePElement.classList.add("archive-title");
        titlePElement.innerHTML = item.name;

        const gridEditElement = document.createElement("a");
        gridEditElement.classList.add("edit-non-desktop");
        gridEditElement.innerHTML = "(edit)";
        gridEditElement.href = `#`;
        gridEditElement.addEventListener("click", (e) => {
            e.preventDefault();
            openEditForm(item.id);
        });

        titlePElement.appendChild(gridEditElement);

        archiveContentElement.appendChild(titlePElement);

        const genreUlElement = document.createElement("ul");
        genreUlElement.classList.add("archive-genre");

        for (const genre of genreArr) {
            const genreLiElement = document.createElement("li");
            genreLiElement.innerHTML = genre;

            genreUlElement.appendChild(genreLiElement);
        }

        archiveContentElement.appendChild(genreUlElement);

        const descriptionPElement = document.createElement("p");
        descriptionPElement.classList.add("archive-description");
        descriptionPElement.innerHTML = item.description;

        archiveContentElement.appendChild(descriptionPElement);

        gridElement.appendChild(archiveContentElement);

        // adding the elemnet to the grid
        archiveGridElement.appendChild(gridElement);
    }

    ////////////////////////////////////////////////////////////////////////////

    const animeYears = [
        ...new Set(currentArchive.map((item) => item.year)),
    ].sort((x, y) => x - y);
    animeYears.unshift(null);

    for (const year of animeYears) {
        if (year === yearFilter) {
            const yearActivatedLink = document.createElement("a");
            yearActivatedLink.href = "#";
            yearActivatedLink.classList.add("filter-link");
            yearActivatedLink.classList.add("filter-link-activated");
            yearActivatedLink.innerHTML = year ?? "All years";
            yearActivatedLink.addEventListener("click", (e) => {
                e.preventDefault();
                setYearFilter(null);
            });

            filterYearsElement.appendChild(yearActivatedLink);

            continue;
        }

        const yearLink = document.createElement("a");
        yearLink.innerHTML = year ?? "All years";
        yearLink.href = "#";
        yearLink.classList.add("filter-link");
        yearLink.addEventListener("click", (e) => {
            e.preventDefault();
            setYearFilter(year);
        });

        filterYearsElement.appendChild(yearLink);
    }
};

const openEditForm = (itemId) => {
    // finds an item from currentArchive with id `itemId`
    const item = currentArchive.find((item) => item.id === itemId);

    if (!item) {
        return;
    }

    editingId = itemId;

    document.getElementById("Name").value = item.name;
    document.getElementById("Poster").value = item.poster;
    document.getElementById("Year").value = item.year;
    document.getElementById("Genre").value = item.genre;
    document.getElementById("Description").value = item.description;

    formDialog.showModal();
};

const openAddForm = () => {
    editingId = null;

    document.getElementById("Name").value = "";
    document.getElementById("Poster").value = "";
    document.getElementById("Year").value = "";
    document.getElementById("Genre").value = "";
    document.getElementById("Description").value = "";

    formDialog.showModal();
};

const closeForm = () => {
    formDialog.close();
};

const submitForm = () => {
    closeForm();

    let name = document.getElementById("Name").value;
    let poster = document.getElementById("Poster").value;
    let year = document.getElementById("Year").value;
    let genre = document.getElementById("Genre").value;
    let description = document.getElementById("Description").value;

    if (editingId === null) {
        // editingId is null; adding new item
        addArchiveItem(name, poster, year, genre, description).then(render);
        return;
    }

    // editingId is not null; editing an existing item
    editArchiveItem(editingId, name, poster, year, genre, description).then(
        render
    );
};

resetButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the entire database?")) {
        resetArchive().then(render);
    }
});

formDialogOpen.addEventListener("click", () => {
    openAddForm();
});

formDialogClose.addEventListener("click", () => {
    closeForm();
});

formDialogSubmit.addEventListener("click", () => {
    submitForm();
});

filterSearchApply.addEventListener("click", () => {
    const searchQuery = document.getElementById("filter-search").value.trim();

    searchFilter = searchQuery === "" ? null : searchQuery;
    render();
});

render();
