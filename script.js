let chart;

function calculate(){

    let T = val("T");
    let v = val("v");
    let D = val("D");
    let A = val("A");
    let L = val("L");
    let flow_area = val("flow_area");

    let cp = 1000;
    let rho = 1.2 * (300 / T);
    let mu = 1.8e-5;
    let k = 0.026;

    let vel = [];
    let Qs = [];
    let Ws = [];

    for(let i=1;i<=15;i++){
        let Re = rho * i * D / mu;
        let Pr = cp * mu / k;
        let Nu = 0.023 * Math.pow(Re,0.8) * Math.pow(Pr,0.4);
        let h = Nu * k / D;

        let Q = h * A * (T-300);

        let f = Re<2300?64/Re:0.3164*Math.pow(Re,-0.25);
        let dP = f*(L/D)*(rho*i*i/2);

        let W = dP * i * flow_area / 0.7;

        vel.push(i);
        Qs.push(Q);
        Ws.push(W);
    }

    drawChart(vel, Qs, Ws);

    let eff = (Qs[7]-Ws[7])/Qs[7];

    document.getElementById("cards").innerHTML = `
        <div class="card">Heat<div class="value">${Qs[7].toFixed(0)} W</div></div>
        <div class="card">Pressure<div class="value">${Ws[7].toFixed(0)} W</div></div>
        <div class="card">Efficiency<div class="value">${eff.toFixed(3)}</div></div>
    `;
}

function drawChart(x, Q, W){

    if(chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
        type: 'line',
        data: {
            labels: x,
            datasets: [
                {label:"Heat Recovery", data:Q, borderColor:"orange"},
                {label:"Fan Power", data:W, borderColor:"cyan"}
            ]
        }
    });
}

function val(id){
    return parseFloat(document.getElementById(id).value);
}

function calculate(){

    // 🔥 能源成本
    let gas_cost = val("gas_use") * val("gas_price");
    let steam_cost = val("steam_use") * val("steam_price");
    let elec_cost = val("electric_use") * val("electric_price");

    let total_energy_cost = gas_cost + steam_cost + elec_cost;

    // 🌬️ 风机功率（新风 + 尾气）
    let fresh_power = val("fresh_flow") * val("fresh_freq");
    let exhaust_power = val("exhaust_flow") * val("exhaust_freq");

    let total_fan = fresh_power + exhaust_power;

    // 🌡️ 余热潜力（简单模型）
    let heat_recovery = val("exhaust_flow") * (val("exhaust_out_temp") - 300);

    // 🏗️ 空间限制判断
    let volume = val("L_space") * val("W_space") * val("H_space");

    let feasibility = volume > 10 ? "✅ Feasible" : "❌ Limited Space";

    // 📊 输出
    document.getElementById("cards").innerHTML = `
        <div class="card">Energy Cost<div class="value">${total_energy_cost.toFixed(0)}</div></div>
        <div class="card">Fan Load<div class="value">${total_fan.toFixed(0)}</div></div>
        <div class="card">Heat Recovery<div class="value">${heat_recovery.toFixed(0)}</div></div>
        <div class="card">Space Check<div class="value">${feasibility}</div></div>
    `;
}
