const scenarioProfiles = {
    equilibrio: {
        salary: 6200,
        workHours: 40,
        commute: 1.1,
        planCost: 85,
        phonePrice: 1200,
        city: 'Berlin',
        profession: 'designer',
        burnout: 42,
        description: 'O cenário equilibrado apresenta maior capacidade de consumo, menor desgaste e tempo suficiente para descanso. A conectividade existe como serviço útil, e não como custo que compromete a renda.'
    },
    precarizacao: {
        salary: 3200,
        workHours: 54,
        commute: 2.6,
        planCost: 160,
        phonePrice: 1800,
        city: 'São Paulo',
        profession: 'delivery',
        burnout: 76,
        description: 'Neste cenário, a renda não acompanha o custo de vida e a conectividade pesa no orçamento. O desgaste psicológico cresce, reduzindo o tempo livre e a capacidade de planejamento futuro.'
    },
    burnout: {
        salary: 7800,
        workHours: 62,
        commute: 3.2,
        planCost: 210,
        phonePrice: 2200,
        city: 'Toronto',
        profession: 'developer',
        burnout: 89,
        description: 'O ganho financeiro compensa parte do esforço, mas a rotina deixa pouco espaço para descanso. Mesmo com melhor acesso digital, a qualidade de vida diminui pelo excesso de trabalho.'
    }
};

const cityFactors = {
    'São Paulo': { cost: 1.22, connectivity: 18, burnout: 68 },
    'Rio': { cost: 1.1, connectivity: 16, burnout: 63 },
    'Belo Horizonte': { cost: 0.95, connectivity: 14, burnout: 58 },
    Berlin: { cost: 1.0, connectivity: 12, burnout: 41 },
    Toronto: { cost: 1.34, connectivity: 15, burnout: 57 }
};

const professionAdjustments = {
    teacher: { salary: 1, hours: 0.9, commute: 1.1 },
    delivery: { salary: 0.7, hours: 1.2, commute: 1.35 },
    designer: { salary: 1.1, hours: 1.0, commute: 1.0 },
    developer: { salary: 1.35, hours: 1.25, commute: 1.1 },
    nurse: { salary: 1.05, hours: 1.15, commute: 1.2 }
};

const form = {
    profession: document.getElementById('profession'),
    city: document.getElementById('city'),
    salary: document.getElementById('salary'),
    workHours: document.getElementById('workHours'),
    commute: document.getElementById('commute'),
    planCost: document.getElementById('planCost'),
    phonePrice: document.getElementById('phonePrice')
};

const labels = {
    salary: document.getElementById('salaryValue'),
    hours: document.getElementById('hoursValue'),
    commute: document.getElementById('commuteValue'),
    plan: document.getElementById('planValue'),
    phone: document.getElementById('phoneValue'),
    days: document.getElementById('daysToBuy'),
    freeTime: document.getElementById('freeTime'),
    connectShare: document.getElementById('connectShare'),
    kpiIncome: document.getElementById('kpiIncome'),
    kpiConnectivity: document.getElementById('kpiConnectivity'),
    kpiWorkHours: document.getElementById('kpiWorkHours'),
    kpiBurnout: document.getElementById('kpiBurnout'),
    timeFreeSummary: document.getElementById('timeFreeSummary'),
    purchaseSummary: document.getElementById('purchaseSummary'),
    connectivitySummary: document.getElementById('connectivitySummary'),
    cityTimeToConsume: document.getElementById('cityTimeToConsume'),
    cityConnectivity: document.getElementById('cityConnectivity'),
    cityBurnout: document.getElementById('cityBurnout'),
    decisionText: document.getElementById('decisionText')
};

const compProfiles = {
    equilibrio: {
        labels: ['Trabalho', 'Conectividade', 'Tempo livre', 'Burnout', 'Poder de compra'],
        values: [72, 46, 81, 38, 83]
    },
    precarizacao: {
        labels: ['Trabalho', 'Conectividade', 'Tempo livre', 'Burnout', 'Poder de compra'],
        values: [92, 76, 34, 81, 42]
    },
    burnout: {
        labels: ['Trabalho', 'Conectividade', 'Tempo livre', 'Burnout', 'Poder de compra'],
        values: [88, 66, 28, 90, 58]
    }
};

let comparisonChart;

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}

function formatHours(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

function computeMetrics() {
    const city = form.city.value;
    const profession = form.profession.value;
    const salary = Number(form.salary.value);
    const weeklyHours = Number(form.workHours.value);
    const commute = Number(form.commute.value);
    const planCost = Number(form.planCost.value);
    const phonePrice = Number(form.phonePrice.value);

    const cityInfo = cityFactors[city] || cityFactors['São Paulo'];
    const professionInfo = professionAdjustments[profession] || professionAdjustments.teacher;

    const netSalary = salary * 4.33;
    const hourlyRate = salary / (weeklyHours * 4.33);
    const dailyWorkHours = weeklyHours / 5;
    const smartphoneDays = Math.max((phonePrice / Math.max(hourlyRate * cityInfo.cost * 2.1, 12)).toFixed(1), 1);
    const freeHours = Math.max(24 - 8 - dailyWorkHours - commute - 1.8 - (planCost / 220), 0);
    const connectivityShare = ((planCost / Math.max(netSalary, 1)) * 100);
    const burnoutIndex = Math.min(100, Math.max(25, 25 + (weeklyHours - 40) * 1.4 + (commute * 14) + (cityInfo.burnout * 0.35) + ((planCost / 200) * 10) - (professionInfo.salary * 10)));

    labels.salary.textContent = formatCurrency(salary);
    labels.hours.textContent = `${weeklyHours}h`;
    labels.commute.textContent = `${commute.toFixed(1)}h`;
    labels.plan.textContent = formatCurrency(planCost);
    labels.phone.textContent = formatCurrency(phonePrice);
    labels.days.textContent = `${Number(smartphoneDays).toFixed(1)}`;
    labels.freeTime.textContent = formatHours(freeHours);
    labels.connectShare.textContent = `${connectivityShare.toFixed(0)}%`;
    labels.kpiIncome.textContent = formatCurrency(netSalary);
    labels.kpiConnectivity.textContent = formatCurrency(planCost);
    labels.kpiWorkHours.textContent = `${weeklyHours}h`;
    labels.kpiBurnout.textContent = `${Math.round(burnoutIndex)}%`;
    labels.timeFreeSummary.textContent = formatHours(freeHours);
    labels.purchaseSummary.textContent = `${Number(smartphoneDays).toFixed(1)} dias`;
    labels.connectivitySummary.textContent = `${connectivityShare.toFixed(0)}%`;

    labels.cityTimeToConsume.textContent = `${Number(smartphoneDays).toFixed(1)} dias`;
    labels.cityConnectivity.textContent = `${Math.round(cityInfo.connectivity)}%`;
    labels.cityBurnout.textContent = `${cityInfo.burnout}%`;

    const recommended = connectivityShare < 12 && burnoutIndex < 55 ?
        'O cenário mais saudável é aquele em que o custo de conectividade fica abaixo de 12% da renda e o burnout não ultrapassa 55%. Nessa condição, o trabalhador consegue manter tempo para descanso, aprendizado e planejamento financeiro.' :
        'O cenário atual ainda exige ajustes. A recomendação é reduzir a carga de trabalho, buscar alternativas de custo de conectividade e reorganizar a rotina para preservar energia e qualidade de vida.';

    labels.decisionText.textContent = recommended;

    return {
        salary,
        weeklyHours,
        commute,
        planCost,
        phonePrice,
        freeHours,
        connectivityShare,
        burnoutIndex,
        cityInfo,
        smartphoneDays,
        city
    };
}

function setCity(cityName) {
    form.city.value = cityName;
    const metrics = computeMetrics();
    const normalized = cityFactors[cityName] || cityFactors['São Paulo'];
    document.querySelectorAll('.city-card').forEach((card) => {
        const isSelected = card.dataset.city === cityName;
        card.classList.toggle('border-brand-400', isSelected);
        card.classList.toggle('bg-brand-500/5', isSelected);
        card.classList.toggle('shadow-neon', isSelected);
    });
    return metrics;
}

function renderComparisonChart(profileKey = 'equilibrio') {
    const profile = compProfiles[profileKey];

    const data = {
        labels: profile.labels,
        datasets: [{
            label: 'Indicador',
            data: profile.values,
            backgroundColor: [
                'rgba(59, 130, 246, 0.85)',
                'rgba(34, 197, 94, 0.85)',
                'rgba(250, 204, 21, 0.85)',
                'rgba(244, 63, 94, 0.85)',
                'rgba(168, 85, 247, 0.85)'
            ],
            borderRadius: 12,
            borderSkipped: false
        }]
    };

    if (comparisonChart) {
        comparisonChart.destroy();
    }

    comparisonChart = new Chart(document.getElementById('comparisonChart'), {
        type: 'bar',
        data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${context.parsed.y}%`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(148, 163, 184, 0.12)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { display: false }
                }
            }
        }
    });
}

function updateScenarioButtons(activeScenario) {
    document.querySelectorAll('.scenario-btn').forEach((button) => {
        const isActive = button.dataset.scenario === activeScenario;

        button.classList.toggle('bg-brand-500/20', isActive);
        button.classList.toggle('text-brand-100', isActive);
        button.classList.toggle('ring-1', isActive);
        button.classList.toggle('ring-brand-400', isActive);
        button.classList.toggle('border', !isActive);
        button.classList.toggle('border-slate-600', !isActive);
        button.classList.toggle('bg-transparent', !isActive);
        button.classList.toggle('text-slate-200', !isActive);
        button.classList.toggle('hover:bg-slate-900/40', !isActive);
        button.classList.toggle('hover:text-white', !isActive);

        if (isActive) {
            button.classList.remove('border', 'border-slate-600', 'bg-transparent', 'text-slate-200');
            button.classList.add('bg-brand-500/20', 'text-brand-100', 'ring-1', 'ring-brand-400');
        }
    });
}

function applyScenario(scenarioKey) {
    const profile = scenarioProfiles[scenarioKey];
    form.profession.value = profile.profession;
    form.city.value = profile.city;
    form.salary.value = profile.salary;
    form.workHours.value = profile.workHours;
    form.commute.value = profile.commute;
    form.planCost.value = profile.planCost;
    form.phonePrice.value = profile.phonePrice;
    labels.decisionText.textContent = profile.description;
    setCity(profile.city);
    computeMetrics();
    renderComparisonChart(scenarioKey);
    updateScenarioButtons(scenarioKey);
}

Object.values(form).forEach((input) => {
    input.addEventListener('input', () => {
        const metrics = computeMetrics();
        if (metrics.city) {
            setCity(metrics.city);
        }
    });
});

form.city.addEventListener('change', () => {
    setCity(form.city.value);
    computeMetrics();
});

form.profession.addEventListener('change', computeMetrics);

document.querySelectorAll('.scenario-btn').forEach((button) => {
    button.addEventListener('click', () => applyScenario(button.dataset.scenario));
});

updateScenarioButtons('equilibrio');

document.querySelectorAll('.city-card').forEach((button) => {
    button.addEventListener('click', () => setCity(button.dataset.city));
});

document.querySelectorAll('.comp-btn').forEach((button) => {
    button.addEventListener('click', () => {
        renderComparisonChart(button.dataset.comp);
        document.querySelectorAll('.comp-btn').forEach((btn) => {
            btn.classList.remove('bg-brand-500', 'text-slate-950');
            btn.classList.add('border', 'border-slate-600', 'bg-slate-900/60', 'text-slate-200');
        });
        button.classList.remove('border', 'border-slate-600', 'bg-slate-900/60', 'text-slate-200');
        button.classList.add('bg-brand-500', 'text-slate-950');
    });
});

renderComparisonChart('equilibrio');
setCity('Berlin');
computeMetrics();
