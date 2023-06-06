var sl_1 = '#slider[name="N"]';
var handl_1 = $('#custom-handle[name="N"]');
var sl_v_1 = 12_000_000;
var [sl_min_1, sl_max_1, sl_step_1] = [20_000, 100_000_000, 250];

var sl_2 = '#slider[name="k"]';
var handl_2 = $('#custom-handle[name="k"]');
var sl_v_2 = 50;
var [sl_min_2, sl_max_2, sl_step_2] = [1, 10_000, 1];

var sl_3 = '#slider[name="Pinf"]';
var handl_3 = $('#custom-handle[name="Pinf"]');
var sl_v_3 = 0.5;
var [sl_min_3, sl_max_3, sl_step_3] = [0.15, 2.5, 0.01];

var sl_4 = '#slider[name="Mt"]';
var handl_4 = $('#custom-handle[name="Mt"]');
var sl_v_4 = 50;
var [sl_min_4, sl_max_4, sl_step_4] = [10, 500, 1];

var sl_5 = '#slider[name="Th"]';
var handl_5 = $('#custom-handle[name="Th"]');
var sl_v_5 = 21;
var [sl_min_5, sl_max_5, sl_step_5] = [7, 60, 1];

var sl_6 = '#slider[name="Dh"]';
var handl_6 = $('#custom-handle[name="Dh"]');
var sl_v_6 = 40;
var [sl_min_6, sl_max_6, sl_step_6] = [1, 200, 1];

var sl_7 = '#slider[name="Ph"]';
var handl_7 = $('#custom-handle[name="Ph"]');
var sl_v_7 = 0.5;
var [sl_min_7, sl_max_7, sl_step_7] = [0.01, 10, 0.01];

var sl_8 = '#slider[name="Vh"]';
var handl_8 = $('#custom-handle[name="Vh"]');
var sl_v_8 = 5;
var [sl_min_8, sl_max_8, sl_step_8] = [1, 20, 1];

var sl_9 = '#slider[name="Pd"]';
var handl_9 = $('#custom-handle[name="Pd"]');
var sl_v_9 = 5;
var [sl_min_9, sl_max_9, sl_step_9] = [0.01, 10, 0.01];



function updateChart() {
    var [N, k, Pinf, Mt, Th, Dh, Ph, Vh, Pd] = [sl_v_1, sl_v_2, sl_v_3/100, sl_v_4, sl_v_5, sl_v_6, sl_v_7/100, sl_v_8, sl_v_9/100];
    var Issue = [],
        Health = [],
        Death = [],
        binWidth = 1,
        min = 0,
        max = 200;
    
    var Contag = Pinf*Mt;
    var StongH = 0;
    var WitnD = 0;
    var Medic = Ph;
    var Ht = 0;
    var tmp_count = Math.round(Th/3);

    if(tmp_count==0){ tmp_count = 1; }
    var tmp_mas = new Array(tmp_count).fill(0);

    var K = k;

    for (var i = min, j = 0; i <= max; i += binWidth, j++) {
        if(i>=Dh && Pd-Medic/10 > 4*Pd/10){
            Medic = Medic + Vh/1000;
        }
        var N_new = N - StongH - WitnD;

        var binCount1 = K;
        var K_new = K*Contag*(N_new-K)/N;
        K = K_new + K - Ht;

        if(K > N){ K = N; }
        else if(K < 0) { K = 0; }
        else{
            if(K-Math.floor(K) > Math.random()){ K = Math.floor(K) + 1; }
            else{ K = Math.floor(K); }
        }

        var Ht2 = tmp_mas[j%tmp_count]*(1-Math.exp(-Math.log(2)/Th));
        Ht = Ht2*(1-Pd+Medic/10);
        
        WitnD += Math.round(Ht2-Ht);
        if(WitnD < 0) { WitnD = 0; }
        var binCount3 = WitnD;

        Ht = Ht + Math.min(N/1000, K)*Medic;
        if(Ht>tmp_mas[j%tmp_count]){ Ht = tmp_mas[j%tmp_count]; }
        else{
            if(Ht-Math.floor(Ht) > Math.random()){ Ht = Math.floor(Ht) + 1; }
            else{ Ht = Math.floor(Ht); }
        }
        StongH += Ht;
        var binCount2 = StongH;

        tmp_mas[j%tmp_count] = binCount1;

        Issue.push([i, binCount1]);
        Health.push([i, binCount2]);
        Death.push([i, binCount3]);
    }

    chart.series[0].setData(Issue);
    chart.series[1].setData(Health);
    chart.series[2].setData(Death);
}

var chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Эпидемиологический калькулятор'
    },
    xAxis: {
        title: {
            text: 'Дни'
        }
    },
    yAxis: {
        title: {
            text: 'Население'
        }
    },
    plotOptions: {
        column: {
            borderWidth: 0.01,
            groupPadding: 0,
            pointPadding: 0
        }
    },
    series: [{
        name: 'Заражённые',
        color: 'rgb(240, 128, 128)'
    }, {
        name: 'Выздоровевшие',
        color: 'rgb(144, 238, 144)'
    }, {
        name: 'Умершие',
        color: 'rgb(105, 105, 105)'
    }]
});

document.getElementById('dowload').onclick = function(){
    var exportObj = { 'download':[sl_v_1, sl_v_2, sl_v_3, sl_v_4, sl_v_5, sl_v_6, sl_v_7, sl_v_8, sl_v_9]};

    var data = JSON.stringify(exportObj);
    var link = document.createElement('a');

    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    link.setAttribute('download', 'data.json');
    link.style.display = 'none';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
};

document.querySelector('[type="file"]').addEventListener('change', (e) => {
    var files = e.target.files;
    var countFiles = files.length;

    if(countFiles==1){
        var selectedFile = files[0];
        if (`${selectedFile.type}`.indexOf('json')==`${selectedFile.type}`.length-4) {
            var reader = new FileReader();
            reader.readAsDataURL(selectedFile);

            reader.addEventListener('load', (e) => {
                $.getJSON(e.target.result, function(data) {
                    [sl_v_1, sl_v_2, sl_v_3, sl_v_4, sl_v_5, sl_v_6, sl_v_7, sl_v_8, sl_v_9] = data['download']; 
                    updateChart();

                    handl_1.text(sl_v_1);
                    $(sl_1).slider({ value: sl_v_1, });
                    handl_2.text(sl_v_2);
                    $(sl_2).slider({ value: sl_v_2, });
                    handl_3.text(sl_v_3);
                    $(sl_3).slider({ value: sl_v_3, });
                    handl_4.text(sl_v_4);
                    $(sl_4).slider({ value: sl_v_4, });
                    handl_5.text(sl_v_5);
                    $(sl_5).slider({ value: sl_v_5, });
                    handl_6.text(sl_v_6);
                    $(sl_6).slider({ value: sl_v_6, });
                    handl_7.text(sl_v_7);
                    $(sl_7).slider({ value: sl_v_7, });
                    handl_8.text(sl_v_8);
                    $(sl_8).slider({ value: sl_v_8, });
                    handl_9.text(sl_v_9);
                    $(sl_9).slider({ value: sl_v_9, });
                });
            });
        }
    }
});


$(document).ready(function() {
    $('#city').change(function() {
        var city = $(this).val();
        $.getJSON('cities.json', function(data) {
            [sl_v_1, sl_v_2, sl_v_3, sl_v_4, sl_v_5, sl_v_6, sl_v_7, sl_v_8, sl_v_9] = data[city]; 
                    updateChart();

                    handl_1.text(sl_v_1);
                    $(sl_1).slider({ value: sl_v_1, });
                    handl_2.text(sl_v_2);
                    $(sl_2).slider({ value: sl_v_2, });
                    handl_3.text(sl_v_3);
                    $(sl_3).slider({ value: sl_v_3, });
                    handl_4.text(sl_v_4);
                    $(sl_4).slider({ value: sl_v_4, });
                    handl_5.text(sl_v_5);
                    $(sl_5).slider({ value: sl_v_5, });
                    handl_6.text(sl_v_6);
                    $(sl_6).slider({ value: sl_v_6, });
                    handl_7.text(sl_v_7);
                    $(sl_7).slider({ value: sl_v_7, });
                    handl_8.text(sl_v_8);
                    $(sl_8).slider({ value: sl_v_8, });
                    handl_9.text(sl_v_9);
                    $(sl_9).slider({ value: sl_v_9, });
        });
    });
});




$(sl_1).slider({
    min:   sl_min_1,
    max:   sl_max_1,
    step:  sl_step_1,
    value: sl_v_1,
    create: function() {
        handl_1.text($(this).slider("value"));
        updateChart();
    },
    slide: function(event, ui) {
        sl_v_1 = ui.value;
        handl_1.text(sl_v_1);
        updateChart();
    }
});

$(sl_2).slider({
    min:   sl_min_2,
    max:   sl_max_2,
    step:  sl_step_2,
    value: sl_v_2,
    create: function() {
        handl_2.text($(this).slider("value"));
    },
    slide: function(event, ui) {
        sl_v_2 = ui.value;
        handl_2.text(sl_v_2);
        updateChart();
    }
});

$(sl_3).slider({
    min:   sl_min_3,
    max:   sl_max_3,
    step:  sl_step_3,
    value: sl_v_3,
    create: function() {
        handl_3.text($(this).slider("value"));
    },
    slide: function(event, ui) {
        sl_v_3 = ui.value;
        handl_3.text(sl_v_3);
        updateChart();
    }
});

$(sl_4).slider({
    min:   sl_min_4,
    max:   sl_max_4,
    step:  sl_step_4,
    value: sl_v_4,
    create: function() {
        handl_4.text($(this).slider("value"));
    },
    slide: function(event, ui) {
        sl_v_4 = ui.value;
        handl_4.text(sl_v_4);
        updateChart();
    }
});

$(sl_5).slider({
    min:   sl_min_5,
    max:   sl_max_5,
    step:  sl_step_5,
    value: sl_v_5,
    create: function() {
        handl_5.text($(this).slider("value"));
    },
    slide: function(event, ui) {
        sl_v_5 = ui.value;
        handl_5.text(sl_v_5);
        updateChart();
    }
});

$(sl_6).slider({
    min:   sl_min_6,
    max:   sl_max_6,
    step:  sl_step_6,
    value: sl_v_6,
    create: function() {
        handl_6.text($(this).slider("value"));
    },
    slide: function(event, ui) {
        sl_v_6 = ui.value;
        handl_6.text(sl_v_6);
        updateChart();
    }
});

$(sl_7).slider({
    min:   sl_min_7,
    max:   sl_max_7,
    step:  sl_step_7,
    value: sl_v_7,
    create: function() {
        handl_7.text($(this).slider("value"));
    },
    slide: function(event, ui) {
        sl_v_7 = ui.value;
        handl_7.text(sl_v_7);
        updateChart();
    }
});

$(sl_8).slider({
    min:   sl_min_8,
    max:   sl_max_8,
    step:  sl_step_8,
    value: sl_v_8,
    create: function() {
        handl_8.text($(this).slider("value"));
    },
    slide: function(event, ui) {
        sl_v_8 = ui.value;
        handl_8.text(sl_v_8);
        updateChart();
    }
});

$(sl_9).slider({
    min:   sl_min_9,
    max:   sl_max_9,
    step:  sl_step_9,
    value: sl_v_9,
    create: function() {
        handl_9.text($(this).slider("value"));
    },
    slide: function(event, ui) {
        sl_v_9 = ui.value;
        handl_9.text(sl_v_9);
        updateChart();
    }
});