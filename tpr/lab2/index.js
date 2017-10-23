(function () {
    const input = document.getElementById('lab2in'),
        probsInput = document.getElementById('lab2probsin'),
        start = document.getElementById('lab2run'),
        clear = document.getElementById('lab2clear'),
        out = document.getElementById('lab2out');

    clear.addEventListener('click', () => input.value = probsInput.value = "");
    start.addEventListener('click', runLab2);

    function runLab2() {

        const temperature = input.value.split(", ").map(Number).filter(Boolean).filter(number => number < 100),
            probabilities = probsInput.value.split(", ").map(eval);
        if(temperature.length !== 12) {
            out.innerHTML = 'Enter T for entire set of months';
            return;
        }
        if(probabilities.length !== 12) {
            out.innerHTML = 'Enter P for entire set of months';
            return;
        }

        const setToClothes = (set) => Object.values(set.clothes),
            sumCost = (sum, elem, index) => sum + elem.cost,
            monthReducer = (toBuy) => {
                return {
                    toBuy,
                    cost: toBuy.filter(Boolean).reduce(sumCost, 0) + 2*toBuy.filter(Boolean).length
                }
            };

        const result = sets.map((set) => {
            const clothes = setToClothes(set),
                months = temperature.map(findSetByT).map(setToClothes)
                    .map(need => _.difference(need, clothes)).map(monthReducer);
            return { months, set };
        })
            .map(element => {
                element.cost = Math.floor(element.months.reduce((acc, e, i) => acc + e.cost*probabilities[i], 0));
                element.transferCost = 10 * Object.values(element.set.clothes).filter(Boolean)
                        .reduce((sum, e) => sum + e.weight, 0);
                element.entire = element.cost + element.transferCost;
                return element;
            });

        out.innerHTML = result.reduce((output, set, index) => {
            output += `Set number ${index} from ${set.set.bottom} to ${set.set.upper}, cost ${set.cost}, transferCost ${set.transferCost}, entire: ${set.entire} : [${Object.values(set.set.clothes).filter(Boolean).map(e => e.name).join(', ')}]`;
            output += '<br />';
            set.months.forEach((month, index) => {
                output += `<span class="span40px"></span>Month number ${index}(+${temperature[index]} degree), cost ${month.cost} y.e.: [${month.toBuy.filter(Boolean).map(e => e.name).join(', ')}]`;
                output += '<br />';
            });
            return output;
        }, "");
    }

    function clothesFactory(name, weight, cost) {
        return { name, weight, cost };
    }

    function setFactory(bottom, upper, [ headwear, body, hand, trousers, footwear ]) {
        return { bottom, upper, clothes: { headwear, body, hand, trousers, footwear } };
    }

    function findSetByT(T) {
        for(let i = 0; i < sets.length; i++) {
            const set = sets[i];
            if(set.bottom <= T && T <= set.upper) return set;
        }
    }

    const blayser   = clothesFactory('Блайзер', 0.5, 6),
        bushlat     = clothesFactory('Бушлат', 4, 48),
        shtanu      = clothesFactory('Ватні штани', 2, 24),
        vietnamki   = clothesFactory('В’єтнамки', 0.5, 6),
        jeans       = clothesFactory('Джинси', 1, 12),
        kepka       = clothesFactory('Кепка', 0.5, 6),
        krosivki    = clothesFactory('Кросівки', 1, 12),
        kurtka      = clothesFactory('Куртка', 2, 24),
        palto       = clothesFactory('Пальто', 3, 36),
        rucavitci   = clothesFactory('Рукавички', 0.5, 6),
        sweater     = clothesFactory('Светр', 1, 12),
        sorochka    = clothesFactory('Сорочка', 0.5, 6),
        footbolka   = clothesFactory('Футболка', 0.5, 6),
        cherevyki   = clothesFactory('Черевики', 1.5, 18),
        choboty     = clothesFactory('Чоботи', 2, 24),
        shapka      = clothesFactory('Шапка', 1, 12),
        shortu      = clothesFactory('Шорти', 0.5, 6),
        handwears   = [ shapka, kepka, blayser ],
        hands       = [ rucavitci ],
        bodies      = [ bushlat, palto, sweater, kurtka, footbolka ],
        trousers    = [ shtanu, shortu, jeans ],
        footwears   = [ choboty, cherevyki, krosivki, vietnamki ],
        clothes     = [...handwears, ...hands, ...bodies, ...trousers, ...footwears ],
        sets = [
            setFactory(-Infinity, -10,  [ shapka,  bushlat,  rucavitci, shtanu, choboty ]),
            setFactory(-9, 0,           [ shapka,  palto,    rucavitci, jeans,  choboty ]),
            setFactory(1, 10,           [ kepka,   kurtka,   null,      jeans,  cherevyki ]),
            setFactory(11, 20,          [ null,    sweater,  null,      jeans,  krosivki ]),
            setFactory(21, 30,          [ blayser, sorochka, null,      jeans,  krosivki ]),
            setFactory(31, Infinity,    [ blayser, sorochka, null,      shortu, vietnamki ])
        ],
        oneKgCost = 10;

    sets.sort((a, b) => a.bottom - b.upper);

})();
