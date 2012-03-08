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
        var e = nodes[i];
        e.x = Math.random() * 50 - 25;
        e.y = Math.random() * 50 - 25;
        e.force = { x: 0, y: 0 };
        if (e.size === undefined)
        {
            e.size = 0;
            for (var j = 0; j < edges.length; j ++)
            {
                if (edges[j].a == i || edges[j].b == i)
                    e.size ++;
            }
        }
        if (e.colour === undefined)
            e.colour = '#f00';
            
        // Create Raphael element
        var c = r.circle(e.x, e.y, e.size + 5).attr({stroke: '#000', fill: e.colour}).translate(250, 250);
        c.index = i;
        c.drag(function(dx, dy) {
            nodes[this.index].x = this.ox + dx;
            nodes[this.index].y = this.oy + dy;
        }, function() {
            this.ox = nodes[this.index].x;
            this.oy = nodes[this.index].y;
            nodes[this.index].dragging = true;
            this.attr({fill: '#fff'});
        }, function() {
            nodes[this.index].dragging = false;
            this.attr({fill: nodes[this.index].colour});        
        });
        c.mouseover(function() { tooltip.innerHTML = nodes[this.index].id; tooltip.style.display = 'block'; });
        c.mouseout(function() { tooltip.style.display = 'none'; tooltip.innerHTML = ''; });
        e.drawElement = c;
    }
    
    // Iterate over edges a *second* time to set up the Raphael objects
    for (var i = 0; i < edges.length; i ++)
    {
        var a = nodes[edges[i].a];
        var b = nodes[edges[i].b];
        var c = r.path('M ' + a.x + ' ' + a.y + ' L ' + b.x + ' ' + b.y).attr({stroke: '#000', 'stroke-width': 2}).translate(250, 250).toBack();
        edges[i].drawElement = c;
    }
    
    this._stable = false;
    this._chargeConstant = 10;
    this._springConstant = 0.01;
    this._springEquillibrium = 40;
    
    this.render = function()
    {
        for (var i = 0; i < edges.length; i ++)
        {
            var a = nodes[edges[i].a];
            var b = nodes[edges[i].b];
            edges[i].drawElement.attr('path', 'M ' + a.x + ' ' + a.y + ' L ' + b.x + ' ' + b.y);
        }
        for (var i = 0; i < nodes.length; i ++)
        {
            nodes[i].drawElement.attr('cx', nodes[i].x);
            nodes[i].drawElement.attr('cy', nodes[i].y);
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
                if (dsq < 0.01) dsq = 0.01; // avoid divide-by-zero
                
                var charge = nodes[i].size * nodes[j].size;
                var push = this._chargeConstant * charge / dsq;

                nodes[i].force.x += (dx / d) * push;
                nodes[i].force.y += (dy / d) * push;
                
                nodes[j].force.x -= (dx / d) * push;
                nodes[j].force.y -= (dy / d) * push;
            }
        }
        
        for (var i = 0; i < edges.length; i ++)
        {
            var a = edges[i].a;
            var b = edges[i].b;
            
            var dx = nodes[a].x - nodes[b].x;
            var dy = nodes[a].y - nodes[b].y;
            var d = Math.sqrt(dx * dx + dy * dy);
            
            var equillibriumDistance = this._springEquillibrium + nodes[a].size + nodes[b].size;
            var push = -this._springConstant * (d - equillibriumDistance);
            
            nodes[a].force.x += (dx / d) * push;
            nodes[a].force.y += (dy / d) * push;
            
            nodes[b].force.x -= (dx / d) * push;
            nodes[b].force.y -= (dy / d) * push;
        }
        
        var maxMove = 0;

        for (var i = 0; i < nodes.length; i ++)
        {
            if (!nodes[i].dragging)
            {
                var dx, dy;
                dx = nodes[i].force.x * 10 / nodes[i].size;
                dy = nodes[i].force.y * 10 / nodes[i].size;
                if (isNaN(dx) || isNaN(dy))
                    continue;
                maxMove = Math.max(maxMove, Math.sqrt(dx * dx + dy * dy));
                nodes[i].x += dx;
                nodes[i].y += dy;
                if (isNaN(nodes[i].x)) nodes[i].x = 1;
                if (isNaN(nodes[i].y)) nodes[i].y = 1;
            }
            nodes[i].force.x = nodes[i].force.y = 0;
        }
        
        this._stable = maxMove < 0.1;
    };
    
    this.timer = setInterval(function() { 
        this.update();
        this.render();
    },
    50);
    
    this.render();
}
