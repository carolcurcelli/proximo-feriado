(function() {

    const name = document.getElementById('name');
    const date = document.getElementById('date');

    const starterDate = new Date();
    const currentDay = starterDate.getDate().toString().padStart(2, "0");
    const currentMonth = (starterDate.getMonth() + 1).toString().padStart(2, "0");
    const currentYear = starterDate.getFullYear();
    let today = currentYear + currentMonth + currentDay;

    const request = new XMLHttpRequest()
    request.open('GET', `https://brasilapi.com.br/api/feriados/v1/${currentYear}`, true)
    request.onload = function() {
        const url = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {

            let holidays = new Array();

            url.forEach(holiday => {
                holidays.push(holiday);
            });

            const projectURL = 'https://carolsvntos.github.io/proximo-feriado'
            const stateSelection = document.getElementById('state');

            stateSelection.addEventListener('change', (e) => {
                const selectedState = stateSelection.value;
                if(selectedState !== 'all') {
                    fetch(`${projectURL}/assets/data/${selectedState}.json`)
                    .then((response) => response.json())
                    .then((json) => 
                        console.log(json[0].name)
                        // fazer um for que adiciona cada item do json em holiday
                        // fazer comparação de novo
                    );
                }
            });

            for (i = 0; i <= holidays.length; i++) {

                const comparisonDate = parseInt(holidays[i]?.date.replace(/[^a-zA-Z0-9 ]/g, ''));
                today = parseInt(today);

                if (comparisonDate >= today) {
                    let holidayDate = holidays[i].date.split("-").reverse().join("/");
                    let holidayClass = holidays[i].name.toLowerCase().split(' ').join('-');

                    document.body.classList.add(holidayClass);
                    document.title = `O Próximo Feriado Nacional é ${holidays[i].name}`
                    name.innerHTML = holidays[i].name;
                    date.innerHTML = holidayDate;

                    break
                }
            }

        } else {
            const errorMessage = document.createElement('marquee')
            errorMessage.textContent = `Gah, it's not working!`
            app.appendChild(errorMessage)
        }
    }

    request.send()

})();