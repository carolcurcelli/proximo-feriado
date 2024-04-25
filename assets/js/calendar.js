(function() {

    const calendar = document.getElementById('calendar');
    const stateSelection = document.getElementById('state');
    const year = document.getElementById('year');
    const starterDate = new Date();
    const currentYear = starterDate.getFullYear();
    let feriadoAPI = '';
    const christmas = new Date(`${currentYear}-12-25`);
    let mixHolidays;
    let author = document.getElementById('author');

    year.innerText = currentYear;

    if (starterDate <= christmas) {
        feriadoAPI = `https://brasilapi.com.br/api/feriados/v1/${currentYear}`
    } else {
        feriadoAPI = `https://brasilapi.com.br/api/feriados/v1/${currentYear + 1}`;
    }

    const request = new XMLHttpRequest()
    request.open('GET', `${feriadoAPI}`, true)
    request.onload = function() {
        const url = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            let nationalHolidays = new Array();
            url.forEach(holiday => {
                nationalHolidays.push(holiday);
            });
            nationalHolidays.forEach(holiday => {
                holiday.date = holiday.date.substring(5);
            })

            function printNationalHolidays() {
                let headerRow = document.createElement('tr');
                headerRow.innerHTML = `
        <th>Feriado</th>
        <th>Tipo</th>
        <th>Data</th>
        <th>Dia</th>
    `;
                calendar.appendChild(headerRow);
                for (i = 0; i < nationalHolidays.length; i++) {
                    let tr = document.createElement('tr');
                    let nationalHolidayWeekday = `${currentYear}-${nationalHolidays[i].date}`;

                    tr.innerHTML = `
                            <td data-th="Feriado">${nationalHolidays[i].name === 'Confraternização mundial' ? 'Ano Novo' : nationalHolidays[i].name}</td>
                            <td data-th="Tipo">${nationalHolidays[i].type === 'national' ? 'Nacional' : 'Estadual'}</td>
                            <td data-th="Data">${nationalHolidays[i].date.split("-").reverse().join("/")}</td>
                            <td data-th="Dia">${new Date(nationalHolidayWeekday).toLocaleDateString('pt-BR', {  weekday: 'long', timeZone: 'gmt'  })}</td>
                            `
                    calendar.appendChild(tr);
                }
            }
            printNationalHolidays();

            stateSelection.addEventListener('change', (e) => {
                const projectURL = 'https://qualproximoferiado.com.br/';
                const selectedState = stateSelection.value;
                fetch(`${projectURL}/assets/data/${selectedState}.json`)
                    .then((response) => response.json())
                    .then((json) => {
                        // Assuming json is an array of holiday objects
                        function printMixHolidays() {
                            // Limpa o conteúdo de calendar
                            calendar.innerHTML = '';
                            // Add header row
                            let headerRow = document.createElement('tr');
                            headerRow.innerHTML = `
                                    <th>Feriado</th>
                                    <th>Tipo</th>
                                    <th>Data</th>
                                    <th>Dia</th>
                                `;
                            calendar.appendChild(headerRow);
                            if (selectedState !== 'all' &&
                                selectedState !== 'goias' &&
                                selectedState !== 'parana') {
                                mixHolidays = nationalHolidays.concat(json);
                            } else {
                                mixHolidays = nationalHolidays;
                            }

                            mixHolidays.sort((a, b) => {
                                if (a.date > b.date) return 1;
                                if (a.date < b.date) return -1;
                                return 0;
                            });

                            for (let i = 0; i < mixHolidays.length; i++) {
                                let tr = document.createElement('tr');
                                let nationalHolidayWeekday = `${currentYear}-${mixHolidays[i].date}`;
                                tr.innerHTML = `
                                        <td data-th="Feriado">${mixHolidays[i].name === 'Confraternização mundial' ? 'Ano Novo' : mixHolidays[i].name}</td>
                                        <td data-th="Tipo">${mixHolidays[i].type === 'national' ? 'Nacional' : 'Estadual'}</td>
                                        <td data-th="Data">${mixHolidays[i].date.split("-").reverse().join("/")}</td>
                                        <td data-th="Dia">${new Date(nationalHolidayWeekday).toLocaleDateString('pt-BR', {  weekday: 'long', timeZone: 'gmt'  })}</td>
                                    `;
                                calendar.appendChild(tr);
                            }
                        }
                        printMixHolidays();
                        console.log(mixHolidays);


                        // You can perform any further processing here if needed
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
                fetch(`${projectURL}/assets/data/estados.json`)
                    .then((response) => response.json())
                    .then((json) => {
                        function printCredits() {
                            let i = 0;
                            while (i < json.length) {
                                if (json[i].slug === selectedState) {
                                    document.body.className = json[i].slug;
                                    author.innerHTML = `Fotografia por <a href="${json[i].url}">${json[i].author}</a>`
                                    break
                                }
                                i++;
                            }
                        }
                        printCredits();
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            });

        } else {
            const errorMessage = document.createElement('marquee')
            errorMessage.textContent = `Gah, it's not working!`
            app.appendChild(errorMessage)

        }
    }
    request.send()

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

})();