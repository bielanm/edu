(function () {

    const input = document.getElementById('lab1in'),
        start = document.getElementById('lab1run'),
        clear = document.getElementById('lab1clear'),
        parettoChart = document.getElementById('lab1ParettoChart').getContext('2d'),
        slayterChart = document.getElementById('lab1SlayterChart').getContext('2d'),
        slayterOut = document.getElementById('lab1SlayterOut'),
        parettoOut = document.getElementById('lab1ParettoOut');

    clear.addEventListener('click', () => input.value = "");
    start.addEventListener('click', runLab1);

    function runLab1() {

        function getSolutionSubset(source, condition) {
            const solution = source.map(e => e);

            for(let i = 0; i < source.length; i++) {
                for(let j = 0; j < source.length; j++) {
                    const first = solution[i],
                        second = source[j];

                    if(condition(second, first)) {
                        solution[i] = undefined;
                        break;
                    }
                }
            }

            return solution.filter(Boolean);
        }

        const array = input.value.split(", ").map(Number).filter(Boolean).filter(number => number < 100),
            floor = Math.floor,
            parettoCondition = (a, b) => floor(a/10) >= floor(b/10) && a % 10 >= b % 10 && a != b,
            slayterCondition = (a, b) => floor(a/10) > floor(b/10) && (a % 10 > b % 10) && (a != b);

        const parettoSubset = getSolutionSubset(array, parettoCondition),
            slayterSubset = getSolutionSubset(array, slayterCondition);

        parettoOut.innerHTML = `[${parettoSubset.join(", ")}]`;
        slayterOut.innerHTML = `[${slayterSubset.join(", ")}]`;

        const mapValue = (element) => {return { x: floor(element/10), y: element % 10 }},
            buildDataObject = (label, color, data) => {
                return {
                    label,
                    pointBackgroundColor: color,
                    borderColor: color,
                    backgroundColor: color,
                    data: data.map(mapValue)
                }
            },
            sourceData = buildDataObject('Source', 'blue', array),
            parettoData = buildDataObject('Parretto Dataset', 'red', parettoSubset),
            slayterData = buildDataObject('Slayter Dataset', 'red', slayterSubset),
            buildScatterChart = (datasets) => {
                return {
                    type: 'scatter',
                    data: { datasets },
                    options: {
                        scales: {
                            xAxes: [{
                                type: 'linear',
                                position: 'bottom'
                            }]
                        }
                    }
                }
            };

        const parettoChartJS = new Chart(parettoChart, buildScatterChart([ parettoData, sourceData ])),
            slayrerhartJS = new Chart(slayterChart, buildScatterChart([ slayterData, sourceData]));
    }

})();
