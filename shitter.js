/**
 * Come funziona
 * 
 * - Connettiti a Whatsapp web e seleziona la chat degli Scendisti®
 * - Scorri le conversazioni fino al 5 gennaio 2024
 * - Premi F12 per DevTools
 * - Nota che potresti non riuscire a incollare il codice e dovrai scrivere 'allow paste'
 * - Copia e incolla il codice sottostante
 */

const fetchShit = () => {
    let rawData = [];
    /**
     * [
     *  {name: 'Andrea Damiano', date: Sat Jan 13 2024 10:04:00 GMT+0100 (Ora standard dell’Europa centrale), parsedDate: '13/1/2024 10:04'},
        {name: 'Daniel Godino', date: Sat Jan 13 2024 12:22:00 GMT+0100 (Ora standard dell’Europa centrale), parsedDate: '13/1/2024 12:22'},
        {name: 'Ale 😎', date: Sat Jan 13 2024 17:22:00 GMT+0100 (Ora standard dell’Europa centrale), parsedDate: '13/1/2024 17:22'}
        ]
    */
    const toAmericanDateFormat = (dateString = '') => {
        const splittedDate = dateString.split('/')
        return `${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`
    }
    const parseShitterData = (rawValue = '') => {
        const splittedValue = rawValue.split(']');
        const rawDate = splittedValue[0].replace('[', '').replace(']', '').replace(',', '')
        const parsedDate = toAmericanDateFormat(`${rawDate.split(' ')[1]} ${rawDate.split(' ')[0]}`)
        return {
            name: splittedValue[1].replace(':', '').trim(),
            date: new Date(parsedDate),
            parsedDate
        }
    }
    document.querySelectorAll('img[data-plain-text="💩"]').forEach(
        (node) => {
            const shitter = node.parentElement.parentElement.parentElement.parentElement.attributes['data-pre-plain-text'].value;
            rawData.push(parseShitterData(shitter));

        }
    );
    return rawData;
}

// Function to build statistics
const buildStatistics = (data) => {
    const stats = {
        dailyMostFrequentNames: {},
        overallMostFrequentName: null,
        overallLeastFrequentName: null,
        dailyNameCounts: {}
    };

    const nameCount = {};
    let nameDaylyCount = {};
    let prevDateChanged = '';
    data.forEach((shitter) => {
        // Count occurrences by name
        const { name, date } = shitter;
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        if (prevDateChanged !== formattedDate) {
            stats.dailyNameCounts[formattedDate] = {}
            prevDateChanged = formattedDate
            nameDaylyCount = {}
        }
        nameCount[name] = (nameCount[name] || 0) + 1;
        nameDaylyCount[name] = (nameDaylyCount[name] || 0) + 1;
        stats.dailyNameCounts[formattedDate] = {
            ...stats.dailyNameCounts[formattedDate],
            [name]: {
                count: nameDaylyCount[name]
            }
        }

        // Update daily most frequent name
        if (!stats.dailyMostFrequentNames[formattedDate] || nameCount[name] >= nameCount[stats.dailyMostFrequentNames[formattedDate].name]) {
            stats.dailyMostFrequentNames[formattedDate] = {
                name,
                count: nameDaylyCount[name]
            };
        }
    });

    // Find the overall most and least frequent names
    const names = Object.keys(nameCount);
    stats.overallMostFrequentName = names.reduce((maxName, name) => (nameCount[name] > nameCount[maxName] ? name : maxName), names[0]);
    stats.overallLeastFrequentName = names.reduce((minName, name) => (nameCount[name] < nameCount[minName] ? name : minName), names[0]);

    // Attach the total count for the overall most frequent name
    stats.overallMostFrequentCount = nameCount[stats.overallMostFrequentName];
    stats.overallLestFrequentCount = nameCount[stats.overallLeastFrequentName]

    return stats;
};

const renderStatisticsByDay = (stats, layers=0) => {
    const entries = Object.entries(stats)
    let output = [];
    let tabsByLayer = '';
    for (let layer=0; layer<layers; layer++) {
        tabsByLayer = tabsByLayer + '\t'
    }
    entries.forEach((entry) => {
        output.push(`${tabsByLayer}${entry[0]}: ${entry[1].count}`)
    })
    return output.join('\n')
}

const renderDailyMostFrequentName = (stats) => {
    return (`${stats.name}: ${stats.count}`)
}

const renderDailyMostFrequestNames = (stats) => {
    const entries = Object.entries(stats);
    let output = [];
    entries.forEach((entry) => {
        output.push(`\t${entry[0]}\n\t\t${renderDailyMostFrequentName(entry[1])}`)
    })
    return output.join('\n')
}

const showStatisticsByDay = (statistics, day = new Date().getDate()) => {
    const days = Object.keys(statistics.dailyMostFrequentNames);
    const isToday = day === new Date().getDate();
    const today = isToday ? days[days.length - 1] : days.filter((dayOfMonth) => dayOfMonth.includes(`${day}/`));
    const dailyMostFrequentName = renderDailyMostFrequentName(statistics.dailyMostFrequentNames[today]);
    const todayStatatiscs = renderStatisticsByDay(statistics.dailyNameCounts[today]);
    console.log('Today\'s Most Frequent Shitter: ', dailyMostFrequentName);
    console.log('Almost there buddies, get your shit together:\n', todayStatatiscs)
};

const renderStatisticsByMonth = (stats, month = new Date().getMonth() + 1) => {
    const entries = Object.entries(stats).filter((entry) => entry[0].includes(`/${month}/`));
    let output = [];
    entries.forEach((entry) => {
        const day = entry[0];
        output.push(`\t${day}\n${renderStatisticsByDay(entry[1], 3)}`)
    })
    return output.length > 0 ? output.join('\n') : ''
}

const showStatisticsByMonth = (statistics) => {
    const months = [
        {name: 'January', code: 1},
        {name: 'Februay', code: 2},
        {name: 'March', code: 3},
        {name: 'April', code: 4},
        {name: 'May', code: 5},
        {name: 'June', code: 6},
        {name: 'July', code: 7},
        {name: 'August', code: 8},
        {name: 'September', code: 9},
        {name: 'October', code: 10},
        {name: 'November', code: 11},
        {name: 'December', code: 12}];
    console.log('Monthly crazy piecies of shits')
    months.forEach(({name, code}) => {
        const monthCurrentStats = renderStatisticsByMonth(statistics.dailyNameCounts, code);
        const isMonthEmpty = monthCurrentStats === '';
        if (!isMonthEmpty)
            console.log(`${name}:\n`, monthCurrentStats)
    })
}

const showOverallStatistics = (statistics) => {
    //console.log(statistics)
    showStatisticsByDay(statistics, 13)
    // showStatisticsByMonth(statistics)
    const dailyBestShitters = renderDailyMostFrequestNames(statistics.dailyMostFrequentNames)
    console.log('Daily Most Frequent Names: \n', dailyBestShitters);
    console.log('Overall Most Frequent Name:', statistics.overallMostFrequentName, 'Count:', statistics.overallMostFrequentCount);
    console.log('Overall Least Frequent Name:', statistics.overallLeastFrequentName, 'Count:', statistics.overallLestFrequentCount);
}

const data = fetchShit()
const statistics = buildStatistics(data);
showOverallStatistics(statistics)