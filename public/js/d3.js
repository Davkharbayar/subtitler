// Set up SVG canvas dimensions
const svgWidth = window.innerWidth;
const svgHeight = window.innerHeight;

// Select the SVG element and set its width and height
const svg = d3.select("#background-animation")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Number of waves
const numberOfWaves = 5;

// Create path data for waves
let wavesData = d3.range(numberOfWaves).map(function(i) {
    return {
        yOffset: Math.random() * svgHeight, // Random yOffset for different heights
        amplitude: 20 + Math.random() * 50, // Increased amplitude range for more variation
        frequency: 0.005 + Math.random() * 0.03, // Adjusted frequency range for voice effect
        phase: Math.random() * Math.PI * 2,
        color: getRandomColor() // Random color for each wave
    };
});

// Create the waves using the data
const waves = svg.selectAll("path")
    .data(wavesData)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function(d) { return d.color; })
    .attr("stroke-width", 2)
    .attr("opacity", 0.6);

// Animation loop with D3.js timer
let time = 0;
d3.timer(function() {
    time += 0.05;

    waves.attr("d", function(d) {
        return generateWavePath(d.yOffset, d.amplitude, d.frequency, d.phase, time);
    });

    subtitles.attr("x", function(d) {
        return (parseFloat(d3.select(this).attr("x")) + 1) % svgWidth; // Marquee-like movement
    });
});

// Function to generate wave path
function generateWavePath(yOffset, amplitude, frequency, phase, time) {
    const points = d3.range(0, svgWidth, 10).map(function(x) {
        const y = yOffset + Math.sin(frequency * x + phase + time) * amplitude;
        return [x, y];
    });

    return d3.line()(points);
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Add random text as subtitles
const subtitlesData = [
    "Voice Frequency",
    "Ambient Noise",
    "Sound Waves",
    "Harmony",
    "Resonance",
    "Echo Effect",
    "Rhythm of Nature",
    "Soundscape"
];

// Create text elements
const subtitles = svg.selectAll("text")
    .data(d3.range(10))
    .enter()
    .append("text")
    .text(function() { return subtitlesData[Math.floor(Math.random() * subtitlesData.length)]; })
    .attr("x", function() { return Math.random() * svgWidth; })
    .attr("y", function() { return Math.random() * svgHeight; })
    .attr("fill", getRandomColor)
    .attr("font-size", function() { return 15 + Math.random() * 20; })
    .attr("opacity", function() { return 0.4 + Math.random() * 0.2; })
    .attr("text-anchor", "middle");
