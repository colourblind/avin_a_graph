function graph_svg(target, nodes, edges)
{
    var r = Raphael(target, 500, 500);
    var tooltip = document.getElementById('tooltip');
    
    // Change node ids for indexes in edge list
    for (var i = 0; i < edges.length; i ++)
    {
        for (var j = 0; j < nodes.length; j ++)
        {
            if (edges[i].a == nodes[j].id)
                edges[i].a = j
            if (edges[i].b == nodes[j].id)
                edges[i].b = j;
        }
    }
 
    for (var i = 0; i < nodes.length; i ++)
    {
        nodes[i].x = Math.random() * 50 - 25;
        nodes[i].y = Math.random() * 50 - 25;
        nodes[i].force = { x: 0, y: 0 };
        if (nodes[i].size === undefined)
        {
            nodes[i].size = 0;
            for (var j = 0; j < edges.length; j ++)
            {
                if (edges[j].a == i || edges[j].b == i)
                    nodes[i].size ++;
            }
        }
        if (nodes[i].colour === undefined)
            nodes[i].colour = '#f00';
    }
    
    this._stable = false;
    
    this.render = function()
    {
        r.clear();
    
        for (var i = 0; i < edges.length; i ++)
        {
            var a = nodes[edges[i].a];
            var b = nodes[edges[i].b];
            r.path('M ' + a.x + ' ' + a.y + ' L ' + b.x + ' ' + b.y).attr({stroke: '#000', 'stroke-width': 2}).translate(250, 250);
        }
        for (var i = 0; i < nodes.length; i ++)
        {
            var e = nodes[i];
            var colour = nodes[i].colour;
            var c = r.circle(e.x, e.y, e.size + 5).attr({stroke: '#000', fill: colour}).translate(250, 250);
            c.id = e.id;
            c.mouseover(function(event) { this.attr({fill: '#fff'}); tooltip.innerHTML = this.id; tooltip.style.display = 'block'; });
            c.mouseout(function(event) { this.attr({fill: colour}); tooltip.style.display = 'none'; });        
        }
    };
    
    this.update = function()
    {
        if (this._stable)
            return;
        
        for (var i = 0; i < nodes.length; i ++)
        {
            for (var j = i + 1; j < nodes.length; j ++)
            {
                var dx = nodes[i].x - nodes[j].x;
                var dy = nodes[i].y - nodes[j].y;
                var dsq = (dx * dx + dy * dy);
                var d = Math.sqrt(dsq);
                if (dsq > 1) dsq = 1; // avoid divide-by-zero
                var push = 1 / dsq;

                nodes[i].force.x += (dx / d) * push;
                nodes[i].force.y += (dy / d) * push;
                
                nodes[j].force.x -= (dx / d) * push;
                nodes[j].force.y -= (dy / d) * push;
            }
            
            // Gentle pull to centre so we don't lose disconnected graphs/nodes
            var dsq = (nodes[i].x * nodes[i].x + nodes[i].y * nodes[i].y);
            nodes[i].force.x -= nodes[i].x * (dsq / 300000) * nodes[i].size;
            nodes[i].force.y -= nodes[i].y * (dsq / 300000) * nodes[i].size;
        }
        
        for (var i = 0; i < edges.length; i ++)
        {
            var a = edges[i].a;
            var b = edges[i].b;
            
            var dx = nodes[a].x - nodes[b].x;
            var dy = nodes[a].y - nodes[b].y;
            var dsq = (dx * dx + dy * dy);
            var d = Math.sqrt(dsq);
            if (dsq > 0.01) dsq = 0.01; // avoid divide-by-zero
            var push = -dsq * 200;
            
            nodes[a].force.x += (dx / d) * push;
            nodes[a].force.y += (dy / d) * push;
            
            nodes[b].force.x -= (dx / d) * push;
            nodes[b].force.y -= (dy / d) * push;
        }
        
        var totalSq = 0;

        for (var i = 0; i < nodes.length; i ++)
        {
            totalSq = nodes[i].force.x * nodes[i].force.x + nodes[i].force.y * nodes[i].force.y;
            nodes[i].x += nodes[i].force.x;
            nodes[i].y += nodes[i].force.y;
            nodes[i].force.x = nodes[i].force.y = 0;
        }
        
        this._stable = totalSq < 0.0001;
    };
    
    this.timer = setInterval(function() { 
        this.update();
        this.render();
    },
    100);
    
    this.render();
}
