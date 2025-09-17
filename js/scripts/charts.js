// Set thousands separator as comma
Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});


fetch('http://localhost:5000/get_monthly_data', {method: 'GET'})
    .then(response => response.json())
    .then(data => {
        months = [];
        counts = [];
        avgJacBgp = [];
        avgJacCidr = [];

        data.forEach(item => {
            months.push(item.month);
            counts.push(item.ipv4_prefix_bgp);
            avgJacBgp.push(item.jac_val_bgp);
            avgJacCidr.push(item.jac_val_cidr);
        });

        // Chart 1: Unique BGP Prefix Pairs per Month
        Highcharts.chart('plot-unq-prefixes', {
            title: { text: "Unique BGP Prefix Pairs per Month" },
            xAxis: { categories: months },
            yAxis: { title: { text: "Count" } },
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
                name: "Unique Pairs",
                data: counts,
            }]
        });

        // Chart 2: Jaccard Trends
        Highcharts.chart('plot-jc-bgp-vs-tuned', {
            title: { text: "Trends of Jaccard Values: BGP vs CIDR" },
            xAxis: { categories: months },
            yAxis: { title: { text: "Average Jaccard Value" } },
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
    })
    .catch(error => console.error('Error loading JSON:', error));