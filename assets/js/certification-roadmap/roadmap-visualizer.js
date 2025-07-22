/**
 * Cloud Certification Roadmap - Roadmap Visualizer
 * 
 * This module handles the visualization of certification roadmaps using D3.js.
 */

// Roadmap Visualizer Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.RoadmapVisualizer = (function() {
    // Private variables
    let svg = null;
    let svgGroup = null;
    let simulation = null;
    let nodes = [];
    let links = [];
    let nodeElements = null;
    let linkElements = null;
    let textElements = null;
    let currentRoadmap = null;
    let selectedNode = null;
    let containerElement = null;
    let zoom = null;
    let filteredNodes = [];
    let activeFilters = {
        provider: null,
        level: null
    };
    
    // Configuration
    const config = {
        width: 800,
        height: 600,
        nodeRadius: 40,
        colors: {
            foundational: '#4CAF50', // Green
            associate: '#2196F3',    // Blue
            professional: '#9C27B0', // Purple
            specialty: '#FF9800',    // Orange
            expert: '#F44336',       // Red
            link: {
                prerequisite: '#555555',
                related: '#999999',
                alternative: '#BBBBBB'
            },
            selected: '#FFC107',     // Amber
            text: '#FFFFFF',
            textDark: '#333333'
        },
        simulation: {
            strength: -300,
            distance: 150
        }
    };
    
    // Private functions
    function initializeSimulation() {
        simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(config.simulation.distance))
            .force('charge', d3.forceManyBody().strength(config.simulation.strength))
            .force('center', d3.forceCenter(config.width / 2, config.height / 2))
            .force('collision', d3.forceCollide().radius(config.nodeRadius * 1.5))
            .on('tick', ticked);
    }
    
    function ticked() {
        // Update link positions
        linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        // Update node positions
        nodeElements
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        // Update text positions
        textElements
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
    
    function getNodeColor(node) {
        if (selectedNode && node.id === selectedNode.id) {
            return config.colors.selected;
        }
        
        // Color based on certification level
        const level = node.level ? node.level.toLowerCase() : '';
        
        if (level.includes('foundational')) return config.colors.foundational;
        if (level.includes('associate')) return config.colors.associate;
        if (level.includes('professional')) return config.colors.professional;
        if (level.includes('specialty')) return config.colors.specialty;
        if (level.includes('expert')) return config.colors.expert;
        
        // Default color
        return config.colors.associate;
    }
    
    function getLinkColor(link) {
        return config.colors.link[link.type] || config.colors.link.related;
    }
    
    function getLinkStrokeWidth(link) {
        if (link.type === 'prerequisite') return 3;
        return 2;
    }
    
    function getLinkDashArray(link) {
        if (link.type === 'alternative') return '5,5';
        if (link.type === 'related') return '3,3';
        return null; // Solid line for prerequisites
    }
    
    function getTextColor(node) {
        // Use dark text on light backgrounds, white text on dark backgrounds
        const level = node.level ? node.level.toLowerCase() : '';
        
        if (level.includes('foundational') || level.includes('specialty')) {
            return config.colors.textDark;
        }
        
        return config.colors.text;
    }
    
    function handleNodeClick(event, d) {
        // Update selected node
        selectedNode = d;
        
        // Update visualization
        updateVisualization();
        
        // Trigger node selection event
        const selectionEvent = new CustomEvent('certification-selected', {
            detail: { certification: d }
        });
        document.dispatchEvent(selectionEvent);
    }
    
    function handleNodeDragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function handleNodeDragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function handleNodeDragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    function updateVisualization() {
        // Apply filters if any are active
        const visibleNodes = applyFilters(nodes);
        const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
        
        // Filter links to only include those between visible nodes
        const visibleLinks = links.filter(link => 
            visibleNodeIds.has(link.source.id || link.source) && 
            visibleNodeIds.has(link.target.id || link.target)
        );
        
        // Update link elements
        linkElements = linkElements
            .data(visibleLinks, d => `${d.source.id || d.source}-${d.target.id || d.target}-${d.type}`)
            .join(
                enter => enter.append('line')
                    .attr('stroke', getLinkColor)
                    .attr('stroke-width', getLinkStrokeWidth)
                    .attr('stroke-dasharray', getLinkDashArray)
                    .attr('marker-end', 'url(#arrowhead)'),
                update => update
                    .attr('stroke', getLinkColor)
                    .attr('stroke-width', getLinkStrokeWidth)
                    .attr('stroke-dasharray', getLinkDashArray),
                exit => exit.remove()
            );
        
        // Update node elements
        nodeElements = nodeElements
            .data(visibleNodes, d => d.id)
            .join(
                enter => enter.append('circle')
                    .attr('r', config.nodeRadius)
                    .attr('fill', getNodeColor)
                    .call(d3.drag()
                        .on('start', handleNodeDragStarted)
                        .on('drag', handleNodeDragged)
                        .on('end', handleNodeDragEnded))
                    .on('click', handleNodeClick),
                update => update
                    .attr('fill', getNodeColor),
                exit => exit.remove()
            );
        
        // Update text elements
        textElements = textElements
            .data(visibleNodes, d => d.id)
            .join(
                enter => enter.append('text')
                    .text(d => d.shortName || d.name.split(' ').pop())
                    .attr('font-size', 10)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', getTextColor)
                    .on('click', handleNodeClick),
                update => update
                    .attr('fill', getTextColor),
                exit => exit.remove()
            );
            
        // Update simulation
        simulation.nodes(visibleNodes);
        simulation.force('link').links(visibleLinks);
        simulation.alpha(0.3).restart();
    }
    
    function applyFilters(nodeList) {
        if (!activeFilters.provider && !activeFilters.level) {
            return nodeList; // No filters active
        }
        
        return nodeList.filter(node => {
            // Provider filter
            if (activeFilters.provider) {
                const nodeProvider = node.id.split('-')[0]; // Extract provider from ID (aws-*, azure-*, gcp-*)
                if (nodeProvider !== activeFilters.provider) {
                    return false;
                }
            }
            
            // Level filter
            if (activeFilters.level && node.level) {
                const nodeLevel = node.level.toLowerCase();
                if (nodeLevel !== activeFilters.level.toLowerCase()) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    function resizeVisualization() {
        if (!containerElement) return;
        
        // Get container dimensions
        const containerRect = containerElement.getBoundingClientRect();
        config.width = containerRect.width;
        config.height = Math.max(500, containerRect.height);
        
        // Update SVG dimensions
        svg
            .attr('width', config.width)
            .attr('height', config.height);
        
        // Update simulation
        simulation
            .force('center', d3.forceCenter(config.width / 2, config.height / 2))
            .alpha(0.3)
            .restart();
    }
    
    // Public API
    return {
        /**
         * Apply filters to the roadmap visualization
         * @param {Object} filters - The filters to apply
         * @param {String} [filters.provider] - Provider filter (aws, azure, gcp)
         * @param {String} [filters.level] - Level filter (foundational, associate, professional, specialty)
         */
        applyFilters: function(filters) {
            activeFilters = {
                provider: filters.provider || null,
                level: filters.level || null
            };
            
            updateVisualization();
        },
        
        /**
         * Reset all filters
         */
        resetFilters: function() {
            activeFilters = {
                provider: null,
                level: null
            };
            
            updateVisualization();
        },
        
        /**
         * Zoom in the visualization
         * @param {Number} [factor=1.2] - Zoom factor
         */
        zoomIn: function(factor = 1.2) {
            if (!svg || !zoom) return;
            svg.transition().duration(300).call(zoom.scaleBy, factor);
        },
        
        /**
         * Zoom out the visualization
         * @param {Number} [factor=0.8] - Zoom factor
         */
        zoomOut: function(factor = 0.8) {
            if (!svg || !zoom) return;
            svg.transition().duration(300).call(zoom.scaleBy, factor);
        },
        
        /**
         * Reset zoom to default
         */
        resetZoom: function() {
            if (!svg || !zoom) return;
            svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
        },
        /**
         * Initialize the roadmap visualization
         * @param {HTMLElement} container - The container element for the visualization
         */
        initVisualization: function(container) {
            if (!container) return;
            
            containerElement = container;
            
            // Create SVG element with zoom support
            svg = d3.select(container)
                .append('svg')
                .attr('width', config.width)
                .attr('height', config.height)
                .attr('class', 'roadmap-visualization');
                
            // Create a group for all visualization elements that will be transformed by zoom
            svgGroup = svg.append('g')
                .attr('class', 'zoom-group');
                
            // Initialize zoom behavior
            zoom = d3.zoom()
                .scaleExtent([0.1, 4])
                .on('zoom', (event) => {
                    svgGroup.attr('transform', event.transform);
                });
                
            // Apply zoom behavior to SVG
            svg.call(zoom)
                .on('dblclick.zoom', null); // Disable double-click zoom
            
            // Add arrow marker definitions for directed links
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', config.nodeRadius + 5)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('xoverflow', 'visible')
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', '#999')
                .style('stroke', 'none');
            
            // Create link group
            linkElements = svg.append('g')
                .attr('class', 'links')
                .selectAll('line');
            
            // Create node group
            nodeElements = svg.append('g')
                .attr('class', 'nodes')
                .selectAll('circle');
            
            // Create text group
            textElements = svg.append('g')
                .attr('class', 'texts')
                .selectAll('text');
            
            // Initialize empty simulation
            initializeSimulation();
            
            // Add resize listener
            window.addEventListener('resize', resizeVisualization);
            
            // Initial resize
            resizeVisualization();
        },
        
        /**
         * Visualize a certification roadmap
         * @param {Object} roadmap - The roadmap to visualize
         */
        visualizeRoadmap: function(roadmap) {
            if (!svg || !roadmap) return;
            
            currentRoadmap = roadmap;
            
            // Reset selected node
            selectedNode = null;
            
            // Prepare nodes data
            nodes = [];
            roadmap.certifications.forEach(cert => {
                // Get certification details from database
                const certData = window.CertificationRoadmap.CertificationDatabase.getCertificationById(cert.id);
                if (certData) {
                    nodes.push({
                        ...certData,
                        status: cert.status,
                        priority: cert.priority,
                        notes: cert.notes
                    });
                }
            });
            
            // Prepare links data
            links = roadmap.paths.map(path => ({
                source: path.from,
                target: path.to,
                type: path.type
            }));
            
            // Update link elements
            linkElements = linkElements
                .data(links, d => `${d.source}-${d.target}-${d.type}`)
                .join(
                    enter => enter.append('line')
                        .attr('stroke', getLinkColor)
                        .attr('stroke-width', getLinkStrokeWidth)
                        .attr('stroke-dasharray', getLinkDashArray)
                        .attr('marker-end', 'url(#arrowhead)'),
                    update => update
                        .attr('stroke', getLinkColor)
                        .attr('stroke-width', getLinkStrokeWidth)
                        .attr('stroke-dasharray', getLinkDashArray),
                    exit => exit.remove()
                );
            
            // Update node elements
            nodeElements = nodeElements
                .data(nodes, d => d.id)
                .join(
                    enter => enter.append('circle')
                        .attr('r', config.nodeRadius)
                        .attr('fill', getNodeColor)
                        .call(d3.drag()
                            .on('start', handleNodeDragStarted)
                            .on('drag', handleNodeDragged)
                            .on('end', handleNodeDragEnded))
                        .on('click', handleNodeClick),
                    update => update
                        .attr('fill', getNodeColor),
                    exit => exit.remove()
                );
            
            // Update text elements
            textElements = textElements
                .data(nodes, d => d.id)
                .join(
                    enter => enter.append('text')
                        .text(d => d.shortName || d.name.split(' ').pop())
                        .attr('font-size', 10)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('fill', getTextColor)
                        .on('click', handleNodeClick),
                    update => update
                        .attr('fill', getTextColor),
                    exit => exit.remove()
                );
            
            // Update simulation
            simulation.nodes(nodes);
            simulation.force('link').links(links);
            simulation.alpha(1).restart();
        },
        
        /**
         * Update the visualization with new data
         * @param {Object} roadmap - The updated roadmap
         */
        updateVisualization: function(roadmap) {
            if (roadmap) {
                this.visualizeRoadmap(roadmap);
            } else {
                updateVisualization();
            }
        },
        
        /**
         * Select a certification node
         * @param {String} certId - The certification ID to select
         */
        selectCertification: function(certId) {
            if (!nodes) return;
            
            // Find node with matching ID
            const node = nodes.find(n => n.id === certId);
            if (node) {
                selectedNode = node;
                updateVisualization();
                
                // Trigger node selection event
                const selectionEvent = new CustomEvent('certification-selected', {
                    detail: { certification: node }
                });
                document.dispatchEvent(selectionEvent);
            }
        },
        
        /**
         * Get the currently selected certification
         * @returns {Object|null} The selected certification or null if none selected
         */
        getSelectedCertification: function() {
            return selectedNode;
        },
        
        /**
         * Clear the visualization
         */
        clearVisualization: function() {
            if (!svg) return;
            
            // Clear data
            nodes = [];
            links = [];
            selectedNode = null;
            currentRoadmap = null;
            
            // Update elements
            linkElements = linkElements.data([]).join();
            nodeElements = nodeElements.data([]).join();
            textElements = textElements.data([]).join();
            
            // Update simulation
            simulation.nodes(nodes);
            simulation.force('link').links(links);
            simulation.alpha(1).restart();
        },
        
        /**
         * Export the visualization as an SVG string
         * @returns {String} The SVG content as a string
         */
        exportSVG: function() {
            if (!svg) return '';
            
            // Clone the SVG element
            const svgClone = svg.node().cloneNode(true);
            
            // Add XML declaration and doctype
            const svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
                '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
                svgClone.outerHTML;
            
            return svgContent;
        },
        
        /**
         * Export the visualization as a PNG data URL
         * @returns {Promise<String>} A promise that resolves to the PNG data URL
         */
        exportPNG: function() {
            return new Promise((resolve, reject) => {
                if (!svg) {
                    reject(new Error('SVG not initialized'));
                    return;
                }
                
                try {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    canvas.width = config.width;
                    canvas.height = config.height;
                    const context = canvas.getContext('2d');
                    
                    // Create an image from the SVG
                    const image = new Image();
                    const svgData = new XMLSerializer().serializeToString(svg.node());
                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);
                    
                    image.onload = function() {
                        // Draw the image on the canvas
                        context.fillStyle = '#FFFFFF';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        context.drawImage(image, 0, 0);
                        
                        // Convert canvas to PNG data URL
                        const pngDataUrl = canvas.toDataURL('image/png');
                        
                        // Clean up
                        URL.revokeObjectURL(url);
                        
                        resolve(pngDataUrl);
                    };
                    
                    image.onerror = function() {
                        URL.revokeObjectURL(url);
                        reject(new Error('Failed to load SVG image'));
                    };
                    
                    image.src = url;
                } catch (error) {
                    reject(error);
                }
            });
        }
    };
})();