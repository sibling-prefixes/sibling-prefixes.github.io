// Set thousands separator as comma
Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});

function renderCharts(data) {
    months = [];
    bgpCounts = [];
    cidrCounts = [];
    avgJacBgp = [];
    avgJacCidr = [];

    const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    data.forEach(item => {
        let label = item.month;
        const parts = item.month.split('-');
        const year = parts[0];
        const mon = parseInt(parts[1], 10);
        if (!Number.isNaN(mon) && mon >= 1 && mon <= 12) {
            label = `${MONTH_NAMES[mon - 1]} '${year.slice(2)}`;
        }
        months.push(label);
        bgpCounts.push(item.unique_bgp_pairs);
        cidrCounts.push(item.unique_cidr_pairs);
        avgJacBgp.push(item.jac_val_bgp);
        avgJacCidr.push(item.jac_val_cidr);
    });

    // Chart 1: Unique BGP Prefix Pairs per Month
    Highcharts.chart('plot-unq-prefixes', {
        title: { text: "Unique BGP and CIDR Prefix Pairs per Month" },
        xAxis: { categories: months },
        yAxis: { min: 0, title: { text: "Count" } },
        chart: {
            type: "spline",
            zoomType: "xy"
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true,
                    radius: 3
                }
            }
        }, 
        series: [{
            id: "bgp-unique-prefix-pairs",
            name: "Unique BGP Pairs",
            color: "#6495ed",
            dashStyle: "Solid", 
            data: bgpCounts,
        },
        {
            id: "cidr-unique-prefix-pairs",
            name: "Unique CIDR Pairs",
            data: cidrCounts,
            color: "#de3163",
            dashStyle: "Solid", 
    
        }]
    });

    // Chart 2: Jaccard Trends
    Highcharts.chart('plot-jc-bgp-vs-tuned', {
        title: { text: "Trends of Jaccard Values: BGP vs CIDR" },
        xAxis: { categories: months },
        yAxis: { min: 0, title: { text: "Average Jaccard Value" } },
        chart: {
            type: "spline",
            zoomType: "xy"
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true,
                    radius: 3
                }
            }
        },
        series: [{ 
            id: "bgp-jaccard",
            name: "BGP Jaccard",
            data: avgJacBgp, 
            color: "#6495ed",
            dashStyle: "Solid", 
        },
        { 
            id: "cidr-jaccard",
            name: "CIDR Jaccard", 
            data: avgJacCidr, 
            color: "#de3163",
            dashStyle: "Solid", 
        }]
    });
}


fetch('http://localhost:5000/get_monthly_data', {method: 'GET'})
    .then(response => {
        if (!response.ok) throw new Error('Server response not OK');
        return response.json();
    })
    .then(data => renderCharts(data))
    .catch(() => {
        console.warn('Falling back to local JSON file.');
        fetch('/data/jsons/monthly_aggregated_data.json')
            .then(response => response.json())
            .then(data => renderCharts(data))
            .catch(error => console.error('Error loading fallback JSON:', error));
    });