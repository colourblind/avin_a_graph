function graph_svg(target, nodes, edges)
{
    var r = Raphael(target, 500, 500);
 
    for (var i = 0; i < nodes.length; i ++)
    {
        nodes[i].x = Math.random() * 10 - 5;
        nodes[i].y = Math.random() * 10 - 5;
        nodes[i].force = { x: 0, y: 0 };
        nodes[i].size = 0;
        for (var j = 0; j < edges.length; j ++)
        {
            if (edges[j].a == i || edges[j].b == i)
                nodes[i].size ++;
        }
    }
    
    this.render = function()
    {
        for (var i = 0; i < edges.length; i ++)
        {
            var a = nodes[edges[i].a];
            var b = nodes[edges[i].b];
            r.path('M ' + a.x + ' ' + a.y + ' L ' + b.x + ' ' + b.y).attr({stroke: '#000', 'stroke-width': 2}).translate(250, 250);
        }
        for (var i = 0; i < nodes.length; i ++)
        {
            var e = nodes[i];
            var c = r.circle(e.x, e.y, e.size * 2 + 8).attr({stroke: '#000', fill: '#f0' + i}).translate(250, 250);
            c.mouseover(function(event) { this.attr({fill: '#fff'}); });
            c.mouseout(function(event) { this.attr({fill: '#f00'}); });        
        }
    }
    
    this.timer = setInterval(function()
    {
        var debug = '';

        for (var i = 0; i < nodes.length; i ++)
        {
            for (var j = i + 1; j < nodes.length; j ++)
            {
                var dx = nodes[i].x - nodes[j].x;
                var dy = nodes[i].y - nodes[j].y;
                var dsq = (dx * dx + dy * dy);
                if (dsq == 0) dsq = 0.1; // avoid divide-by-zero
                var push = 50 / dsq;

                nodes[i].force.x += dx * push;
                nodes[i].force.y += dy * push;
                
                nodes[j].force.x -= dx * push;
                nodes[j].force.y -= dx * push;
            }
            
            for (var j = 0; j < edges.length; j ++)
            {
                if (edges[j].a != i && edges[j].b != i)
                    continue;
                var a = edges[j].a;
                var b = edges[j].b;
                
                var dx = nodes[a].x - nodes[b].x;
                var dy = nodes[a].y - nodes[b].y;
                var dsq = (dx * dx + dy * dy);
                if (dsq == 0) dsq = 0.1; // avoid divide-by-zero
                var push = -dsq / 50000;

                nodes[a].force.x += dx * push;
                nodes[a].force.y += dy * push;
                
                nodes[b].force.x -= dx * push;
                nodes[b].force.y -= dx * push;
            }
        }

        for (var i = 0; i < nodes.length; i ++)
        {
            nodes[i].x += nodes[i].force.x;
            nodes[i].y += nodes[i].force.y;
            nodes[i].force.x = nodes[i].force.y = 0;
        }
        
        $('#debug').html(debug);
        
        r.clear();
        this.render();
    },
    100);
    
    this.render();
}
