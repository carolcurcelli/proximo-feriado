(function() {

    const name = document.getElementById('name');
    const date = document.getElementById('date');
    const daysRemaining = document.getElementById('daysRemaining');
    const stateSelection = document.getElementById('state');

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
                function updateHoliday() {
                    for (i = 0; i <= holidays.length; i++) {
                        const comparisonDate = parseInt(holidays[i]?.date.replace(/[^a-zA-Z0-9 ]/g, ''));
                        today = parseInt(today);

                        if (comparisonDate >= today) {
                            let holidayDate = holidays[i].date.split("-").reverse().join("/");
                            let holidayClass = holidays[i].name.toLowerCase().split(' ').join('-');
                            document.body.className = `holiday ${holidayClass}`;
                            document.title = `O Próximo Feriado Nacional é ${holidays[i].name}`
                            name.innerHTML = holidays[i].name;
                            date.innerHTML = holidayDate;
                            break
                        }
                    }

            const projectURL = 'https://carolsvntos.github.io/proximo-feriado'
            const stateSelection = document.getElementById('state');

            stateSelection.addEventListener('change', (e) => {
                const selectedState = stateSelection.value;
                if(selectedState !== 'all') {
                    fetch(`${projectURL}/assets/data/${selectedState}.json`)
                    .then((response) => response.json())
                    .then((json) =>
                        console.log(json[0].name)
                    );
                    
                }
                updateHoliday();

                stateSelection.addEventListener('change', (e) => {
                    const projectURL = 'https://carolsvntos.github.io/proximo-feriado'
                    const selectedState = stateSelection.value;
                    if(selectedState !== 'all') {
                        fetch(`${projectURL}/assets/data/${selectedState}.json`)
                        .then((response) => response.json())
                        .then((json) => {
                            holidays = holidays.filter(object => {
                                return object.type !== 'estadual';
                            })
                            json.forEach(holiday => {
                                holiday.date = `${currentYear}-${holiday.date}`;
                                holidays.push(holiday);
                            });
                            holidays.sort(function (a, b) {
                                if (a.date > b.date) {
                                    return 1;
                                }
                                if (a.date < b.date) {
                                    return -1;
                                }
                                // a must be equal to b
                                return 0;
                            });
                            updateHoliday();
                        });
                        console.log(holidays)
                    }
                });
                    
        
            } else {
                const errorMessage = document.createElement('marquee')
                errorMessage.textContent = `Gah, it's not working!`
                app.appendChild(errorMessage)
                
                if (comparisonDate >= today) {
                    const nextHoliday = {
                        name: holidays[i].name,
                        date: new Date(comparisonDate),
                        formattedDate: holidays[i].date.split("-").reverse().join("/"),
                        class: holidays[i].name.toLowerCase().split(' ').join('-'),
                    };

                    document.body.classList.add(nextHoliday.class);
                    document.title = `O Próximo Feriado Nacional é ${nextHoliday.name}`
                    name.innerHTML = nextHoliday.name;
                    date.innerHTML = nextHoliday.formattedDate;
                    daysRemaining.innerHTML = countDays(starterDate, nextHoliday.date)

                    break
                }
            }
        }
        request.send()
            
  const countDays = (from, to) => {
    const oneDayInMiliseconds =  24 * 60 * 60 * 1000000;
    return Math.floor((from - to) / oneDayInMiliseconds);
}                
                        
})();