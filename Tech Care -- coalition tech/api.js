
function encryptData(data, shift) {
    let encryptedData = "";
    for (let i = 0; i < data.length; i++) {
        let charCode = data.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            encryptedData += String.fromCharCode((charCode - 65 + shift) % 26 + 65);
        } else if (charCode >= 97 && charCode <= 122) {
            encryptedData += String.fromCharCode((charCode - 97 + shift) % 26 + 97);
        } else {
            encryptedData += data[i];
        }
    }
    return encryptedData;
}
function decryptData(data, shift) {
    return encryptData(data, 26 - shift);
}

document.addEventListener("DOMContentLoaded", function (event) {
    const storedCredentialsJSON = localStorage.getItem('credentials');

    if (storedCredentialsJSON) {
        const storedCredentials = JSON.parse(storedCredentialsJSON);

        const username = decryptData(storedCredentials.username, 3);
        const password = decryptData(storedCredentials.password, 3);

        const auth = btoa(`${username}:${password}`);

        fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
            headers: {
                "Authorization": `Basic ${auth}`
            }
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw response;
        }).then(function (data) {
            createList(data);

            patientInfo(data, "list-4");
        }).catch(function (error) {
            console.warn(error);
        });
    } else {
        console.log("No credentials found in local storage.");
    }

});


function createList(data) {
    const uList = document.getElementById("patient-List");
    const defaultList = document.getElementById("defaultList");
    if (defaultList) {
        uList.removeChild(defaultList);
    }

    data.forEach((datum, ind) => {

        const listItem = document.createElement("li");
        listItem.classList.add("list");
        listItem.setAttribute("pat_list_id", `${"list-" + (+ind + 1)}`);

        const innerDiv = document.createElement("div");
        innerDiv.classList.add("d-flex", "patient");

        const patDetailsDiv = document.createElement("div");
        patDetailsDiv.classList.add("d-flex", "pat-detials");

        const img = document.createElement("img");
        img.src = `${datum.profile_picture}`;
        img.alt = datum.name + " image.png";

        const patInfoDiv = document.createElement("div");
        patInfoDiv.classList.add("pat-info", "ft-14");
        patInfoDiv.innerHTML = `
            <p>${datum.name}</p>
            <span>${datum.gender + ", " + datum.age}</span>`;

        const patMenuSpan = document.createElement("span");
        patMenuSpan.classList.add("pat-menu");

        const menuImg = document.createElement("img");
        menuImg.src = "./assets/icons/hori-menu.svg";
        menuImg.alt = "horizontal menu image";
        menuImg.classList.add("icon");

        patDetailsDiv.appendChild(img);
        patDetailsDiv.appendChild(patInfoDiv);

        patMenuSpan.appendChild(menuImg);

        innerDiv.appendChild(patDetailsDiv);
        innerDiv.appendChild(patMenuSpan);

        listItem.appendChild(innerDiv);

        uList.appendChild(listItem);
    });

    const lists = document.querySelectorAll(".list");
    lists.forEach(li => {
        li.addEventListener("click", (evt) => {
            const list = evt.target.closest("li");
            let attr = list.getAttribute("pat_list_id");
            patientInfo(data, attr);
        });
    });
}



function patientInfo(data, activeList) {
    let activeId = activeList.substring(5);
    activeId = activeId - 1;
    const datum = data[activeId];

    // generate patient information
    generatePatientInfo(datum);

    // lab result
    generateLabResult(datum);

    // diagonosis list
    generateDiagnoticList(datum)

    //handling the graph --  diagnotics histroy
    graphHandler(datum.diagnosis_history);

    //other diagnotics histroy data {respiratoryrate, temp, heartrate}
    vitalSignsHandler(datum.diagnosis_history)

    activeListColor(activeList);
}

function removeChildElement(element) {
    //removes element rendered by the prevActive list
    const children = element.querySelectorAll("*");
    children.forEach(child => {
        child.remove();
    });
}

function graphHandler(dat) {
    let prevCanvas = document.querySelector("#canvasContainer > div:nth-child(2)");
    removeChildElement(prevCanvas);
    const newCanvas = document.createElement("canvas");
    newCanvas.id = "myChart";
    prevCanvas.appendChild(newCanvas);

    let position = +dat.length - 1;
    removeBlurBody()

    const data = {
        labels: ["Oct, 2023", "Nov, 2023", "Dec, 2023", "Jan, 2024", "Feb, 2024", "Mar, 2024"],
        datasets: [{
            label: "Systolic",
            data: [
                dat[position - 5].blood_pressure.systolic.value,
                dat[position - 4].blood_pressure.systolic.value,
                dat[position - 3].blood_pressure.systolic.value,
                dat[position - 2].blood_pressure.systolic.value,
                dat[position - 1].blood_pressure.systolic.value,
                dat[position].blood_pressure.systolic.value,
            ],
            backgroundColor: "#E66FD2",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1
        },
        {
            label: "Diastolic",
            data: [
                dat[position - 5].blood_pressure.diastolic.value,
                dat[position - 4].blood_pressure.diastolic.value,
                dat[position - 3].blood_pressure.diastolic.value,
                dat[position - 2].blood_pressure.diastolic.value,
                dat[position - 1].blood_pressure.diastolic.value,
                dat[position].blood_pressure.diastolic.value,
            ],
            backgroundColor: "#8C6FE6",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
        }]
    };

    // Chart options
    const options = {
        plugins: {
            title: {
                display: false
            },
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        maintainAspectRatio: false,
        responsive: false,
        scales: {
            y: {
                suggestedMin: 60,
                suggestedMax: 180
            }
        },
        elements: {
            line: {
                tension: 0.5
            }
        },
    };
    const ctx = document.getElementById("myChart").getContext("2d");

    // Create the chart
    const myChart = new Chart(ctx, {
        type: "line",
        data: data,
        options: options
    });


    ctx.width = 600;

}


function vitalSignsHandler(datum) {
    let data = datum[0]
    console.log(data);


    // Create a container div
    const pElement = document.querySelector(".vital-signs");
    removeChildElement(pElement);
    const containerDiv = document.createElement('div');
    // Array to hold the data for each sign
    const signsData = [
        {
            imgSrc: "./assets/icons/respiratory rate.svg",
            title: "Respiratory Rate",
            value: `${data.respiratory_rate.value} bpm`,
            status: data.respiratory_rate.levels,
            additionalInfo: statusChecker(data.respiratory_rate.levels)
        },
        {
            imgSrc: "./assets/icons/temperature.svg",
            title: "Temperature",
            value: `${data.temperature.value} °F`,
            status: data.temperature.levels,
            additionalInfo: statusChecker(data.temperature.levels)
        },
        {
            imgSrc: "./assets/icons/HeartBPM.svg",
            title: "Heart Rate",
            value: `${data.heart_rate.value} bpm`,
            status: data.heart_rate.levels,
            additionalInfo: statusChecker(data.heart_rate.levels)
        }
    ];

    // Loop through each sign data and create the corresponding HTML structure
    signsData.forEach((signData, index) => {
        const signDiv = document.createElement("div");
        signDiv.classList.add("signs", `sign-${index + 1}`);

        const signImgDiv = document.createElement("div");
        signImgDiv.classList.add("sign-img");
        const img = document.createElement("img");
        img.src = signData.imgSrc;
        img.alt = `${signData.title} image`;
        signImgDiv.appendChild(img);

        const signInfoDiv = document.createElement("div");
        signInfoDiv.classList.add("sign-info");
        const titleP = document.createElement("p");
        titleP.textContent = signData.title;
        const valueH1 = document.createElement("h1");
        valueH1.textContent = signData.value;
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("ft-13");
        statusSpan.textContent = signData.status;
        signInfoDiv.appendChild(titleP);
        signInfoDiv.appendChild(valueH1);

        // Additional info div for Heart Rate sign
        if (signData.additionalInfo) {
            const additionalInfoDiv = document.createElement("div");
            const additionalInfoP = document.createElement("p");
            additionalInfoP.innerHTML = signData.additionalInfo;
            const additionalInfoSpan = document.createElement("span");
            additionalInfoSpan.classList.add("ft-13");
            additionalInfoSpan.textContent = signData.status;
            additionalInfoDiv.appendChild(additionalInfoP);
            additionalInfoDiv.appendChild(additionalInfoSpan);
            signInfoDiv.appendChild(additionalInfoDiv);
        } else {
            signInfoDiv.appendChild(statusSpan);
        }
        signDiv.appendChild(signImgDiv);
        signDiv.appendChild(signInfoDiv);
        pElement.appendChild(signDiv);
    });


    // Create systolic and diastolic blood pressure element

    const chartExtraContainer = document.querySelector('.chart-extra');
    removeChildElement(chartExtraContainer);
    let sys = data.blood_pressure.systolic
    let dia = data.blood_pressure.diastolic

    const systolicDiv = document.createElement('div');
    systolicDiv.classList.add('systolic', 'blad');
    const systolicP = document.createElement('p');
    systolicP.classList.add('ft-14');
    systolicP.innerHTML = '<span></span> Systolic';

    const systolicH1 = document.createElement('h1');
    systolicH1.textContent = sys.value;

    const systolicAdditionalDiv = document.createElement('div');
    const systolicAdditionalP = document.createElement('p');
    systolicAdditionalP.innerHTML = statusChecker(sys.levels);
    const systolicStatusSpan = document.createElement('span');
    systolicStatusSpan.classList.add('ft-13');
    systolicStatusSpan.textContent = sys.levels;
    systolicAdditionalDiv.appendChild(systolicAdditionalP);
    systolicAdditionalDiv.appendChild(systolicStatusSpan);

    systolicDiv.appendChild(systolicP);
    systolicDiv.appendChild(systolicH1);
    systolicDiv.appendChild(systolicAdditionalDiv);

    // Create diastolic blood pressure element
    const diastolicDiv = document.createElement('div');
    diastolicDiv.classList.add('diastolic', 'blad');

    const diastolicP = document.createElement('p');
    diastolicP.classList.add('ft-14');
    diastolicP.innerHTML = '<span></span> Diastolic';

    const diastolicH1 = document.createElement('h1');
    diastolicH1.textContent = dia.value;

    const diastolicAdditionalDiv = document.createElement('div');
    const diastolicAdditionalP = document.createElement('p');
    diastolicAdditionalP.innerHTML = statusChecker(dia.levels);
    const diastolicStatusSpan = document.createElement('span');
    diastolicStatusSpan.classList.add('ft-13');
    diastolicStatusSpan.textContent = dia.levels;
    diastolicAdditionalDiv.appendChild(diastolicAdditionalP);
    diastolicAdditionalDiv.appendChild(diastolicStatusSpan);

    diastolicDiv.appendChild(diastolicP);
    diastolicDiv.appendChild(diastolicH1);
    diastolicDiv.appendChild(diastolicAdditionalDiv);


    // Append the container div to the element with class "chart-extra"

    // Append systolic and diastolic elements to container
    chartExtraContainer.appendChild(systolicDiv);
    chartExtraContainer.appendChild(diastolicDiv);
}



function generatePatientInfo(datum) {
    const patInfoDiv = document.getElementById("patient-info");
    if (patInfoDiv.innerHTML) {
        let prevPatientInfoContainer = document.querySelector("#patient-info > div");
        patInfoDiv.removeChild(prevPatientInfoContainer);
    }


    const patientInfoContainer = document.createElement("div");
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("image");
    const img = document.createElement("img");
    img.src = datum.profile_picture;
    img.alt = datum.name + "-pat-image.png";
    imageDiv.appendChild(img);

    const heading = document.createElement("h2");
    heading.textContent = datum.name;

    const personalDataDiv = document.createElement("div");
    personalDataDiv.classList.add("personal-data");
    const ul = document.createElement("ul");
    const personalData = [
        { icon: "./assets/icons/BirthIcon.svg", label: "Date Of Birth", value: formatDOB(datum.date_of_birth) },
        { icon: "./assets/icons/FemaleIcon.svg", label: "Gender", value: datum.gender },
        { icon: "./assets/icons/PhoneIcon.svg", label: "Contact Info.", value: datum.phone_number },
        { icon: "./assets/icons/PhoneIcon.svg", label: "Emergency Contacts", value: datum.emergency_contact },
        { icon: "./assets/icons/InsuranceIcon.svg", label: "Insurance Provider", value: datum.insurance_type }
    ];
    personalData.forEach(pData => {
        const li = document.createElement("li");
        const iconImg = document.createElement("img");
        iconImg.src = pData.icon;
        iconImg.alt = pData.label;
        iconImg.classList.add("icon", "p-d-icon");

        const div = document.createElement("div");
        div.classList.add("ft-14", "adin");
        div.innerHTML = `<p>${pData.label}</p><p>${pData.value}</p>`;

        li.appendChild(iconImg);
        li.appendChild(div);

        ul.appendChild(li);
    });
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("btn");
    const button = document.createElement("a");
    button.href = "#";
    button.role = "button";
    button.textContent = "Show All Information";
    button.classList.add("ft-14", "b-r");
    buttonDiv.appendChild(button);
    patientInfoContainer.appendChild(imageDiv);
    patientInfoContainer.appendChild(heading);
    personalDataDiv.appendChild(ul);
    personalDataDiv.appendChild(buttonDiv);
    patientInfoContainer.appendChild(personalDataDiv);
    patInfoDiv.appendChild(patientInfoContainer);
}


function generateLabResult(datum) {
    const labResults = datum.lab_results;
    const labList = document.querySelector(".lab-list");
    removeChildElement(labList);
    labResults.forEach((result, idx) => {
        const li = document.createElement("li");
        li.classList.add("li-test");
        const div = document.createElement("div");
        div.classList.add("d-flex");
        div.classList.add(idx === 0 ? "ft-13" : "ft-14");
        const p = document.createElement("p");
        p.textContent = result;
        const span = document.createElement("span");
        const img = document.createElement("img");
        img.src = "./assets/icons/download.svg";
        img.alt = "downloadIcon.png";
        span.appendChild(img);
        div.appendChild(p);
        div.appendChild(span);
        li.appendChild(div);

        labList.appendChild(li);
    });
}

function generateDiagnoticList(datum) {
    const diaList = datum.diagnostic_list;
    const tbody = document.querySelector("#diagnosis-list > table > tbody");

    removeChildElement(tbody);
    diaList.forEach(dia => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = dia.name;
        row.appendChild(nameCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = dia.description;
        row.appendChild(descriptionCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = dia.status;
        row.appendChild(statusCell);

        tbody.appendChild(row);
    });
}

function removeBlurBody() {
    // this removes the features added when the
    // patient list bar is opened

    document.querySelector("nav").classList.remove("zIndex");
    document.querySelector(".shadow").classList.remove("show-shadow");
    document.body.classList.remove("patList-active");

    showPat.classList.remove("bg-color");
    menuIcon2.classList.remove("open");
    patientContainer.classList.remove("tog");
}

function activeListColor(active) {
    const allList = document.querySelectorAll(".list");
    const act = document.querySelector(`[pat_list_id=${active}]`);
    allList.forEach(li => {
        if (li == act) {
            li.classList.add("active-pat");
        } else {
            li.classList.remove("active-pat");
        }
    });
};

function formatDOB(apiDOB) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let parts = [];
    let year, month, day;

    if (apiDOB.includes("/")) {
        parts = apiDOB.split("/");
        if (parts.length !== 3) throw new Error("Invalid date format");
        [month, day, year] = parts;
    } else if (apiDOB.includes("-")) {
        parts = apiDOB.split("-");
        if (parts.length !== 3) throw new Error("Invalid date format");
        [year, month, day] = parts;
    } else {
        throw new Error("Invalid date format");
    }

    month = months[parseInt(month, 10) - 1];
    day = parseInt(day, 10);

    return `${month} ${day}, ${year}`;
}



function statusChecker(status) {
    const nothing = ""
    if (status == "Normal") {
        return nothing;
    }
    if (status == "Lower than Average") {
        return "&#129171;";
    }
    if (status == "Higher than Average") {
        return "&#129169;";
    }
    return ""
};