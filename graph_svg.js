function graph_svg(source, target, settings)
{
    var r = Raphael(target, 500, 500);

    var root = {x: 0, y: 0, children: []};
    root.children.push({x: 60, y: 0, children: []});
    root.children.push({x: 80, y: 0, children: []});
    root.children.push({x: 12, y: 100, children: []});
    root.children.push({x: 0, y: -20, children: []});
    
    this.render = function(e)
    {
        for (var i = 0; i < e.children.length; i ++)
        {
            this.render(e.children[i]);
            r.path('M ' + e.x + ' ' + e.y + ' L ' + e.children[i].x + ' ' + e.children[i].y).attr({stroke: '#000', 'stroke-width': 2}).translate(250, 250);
        }
        var c = r.circle(e.x, e.y, e.children.length * 2 + 8).attr({stroke: '#000', fill: '#f00'}).translate(250, 250);
        c.mouseover(function(event) { this.attr({fill: '#fff'}); });
        c.mouseout(function(event) { this.attr({fill: '#f00'}); });
    }
    
    this.timer = setInterval(function()
        {
            var nodes = flatten_graph(root);
            var debug = '';

            for (var i = 0; i < nodes.length; i ++)
            {
                var force = { x: 0, y: 0 };
                for (var j = 0; j < nodes.length; j ++)
                {
                    var direction = 1;
                    if (i == j)
                        continue;
                    if (nodes[i].children.indexOf(nodes[j]) != -1)
                        continue;
                        
                    var dx = nodes[i].x - nodes[j].x;
                    var dy = nodes[i].y - nodes[j].y;
                    var dsq = (dx * dx + dy * dy);
                    if (dsq == 0) dsq = 0.1; // avoid divide-by-zero
                    var push = 0;

                    if (nodes[j].children.indexOf(nodes[i]) != -1)
                        push = -dsq / 50000;
                    else
                        push = 50 / dsq;

                    force.x += dx * push;
                    force.y += dy * push;
                }
                nodes[i].x += force.x;
                nodes[i].y += force.y;
            }

            $('#debug').html(debug);
            
            r.clear();
            this.render(root);
        },
        100);
    
    this.render(root);
}

function flatten_graph(node)
{
    var result = [];
    result.push(node);
    for (var i = 0; i < node.children.length; i ++)
        result = result.concat(flatten_graph(node.children[i]));
    return result;
}
