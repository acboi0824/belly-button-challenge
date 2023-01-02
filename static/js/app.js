// function for charts and chart info
function charts(subjectID) {

    // use d3 library to read in samples.json
    d3.json("./data/samples.json").then(data => {
        // test to see all data from url worked
        console.log(data);

        // creating variable samples to store the samples json data
        var samples = data.samples
        // console.log(`samples data only: ${samples}`);

        // creating variables for the bar chart
        var sampleFilter = samples.filter(bacteriaData => bacteriaData.id == subjectID)[0]
        
        var sample_values = sampleFilter.sample_values
        var otu_ids = sampleFilter.otu_ids
        var otu_labels = sampleFilter.otu_labels

        // BAR CHART
        // Create the plots
        var bar_data = [{
            // Use otu_ids for the x values
            x: sample_values.slice(0, 10).reverse(),
            // Use sample_values for the y values
            y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            // Use otu_labels for the text values
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
            // marker: {
            //     color: 'rgb(242, 113, 102)'
            // },
        }]

        var bar_layout = {
            title: `Top 10 Bacteria Species in Subject ${subjectID}`,
            xaxis: { title: "Sample Values"},
            yaxis: { title: "Bacteria IDs"},
        };
        // display bar chart
        Plotly.newPlot("bar", bar_data, bar_layout)


        // BUBBLE CHART
        // Create the trace
        var bubble_data = [{
            // Use otu_ids for the x values
            x: otu_ids,
            // Use sample_values for the y values
            y: sample_values,
            // Use otu_labels for the text values
            text: otu_labels,
            mode: 'markers',
            marker: {
                // Use otu_ids for the marker colors
                color: otu_ids,
                // Use sample_values for the marker size
                size: sample_values,
                colorscale: 'Picnic'
            }
        }];


        // Define plot layout
        var bubble_layout = {
            title: `All Bacteria IDs in Subject ${subjectID} by Sample Values`,
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        // Display plot
        Plotly.newPlot("bubble", bubble_data, bubble_layout)
  })
};

// function for demographic info box
function displayDemoInfo(subjectID) {
    
    var demoInfoBox = d3.select("#sample-metadata");

    d3.json("./samples.json").then(data => {

        var metadata = data.metadata

        var metadataFilter = metadata.filter(bacteriaData => bacteriaData.id == subjectID)[0]
        
        demoInfoBox.html("");

        Object.entries(metadataFilter).forEach(([key, value]) => {
            demoInfoBox.append("p").text(`${key}: ${value}`)
        })
        
    })
};

// function to update the values of the charts and demo table when new dropdown is selected
function optionChanged(subjectID) {
    console.log(subjectID);
    charts(subjectID);
    displayDemoInfo(subjectID);
};

// use this function to initialize the dropdown, charts and demographic info tables
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("./samples.json").then(data => {
        var subjectIDs = data.names;
        subjectIDs.forEach(subjectID => {
            dropdown.append("option").text(subjectID).property("value", subjectID)
        })
        charts(subjectIDs[0]);
        displayDemoInfo(subjectIDs[0]);
    });
};

initDashboard();
