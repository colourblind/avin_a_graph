var nodes = [ 
    { id: 'foo', colour: '#ff0', size: 20 }, 
    { id: 'bar' }, 
    { id: 'baz' }, 
    { id: 'kek' }, 
    { id: 'bur' }, 
    { id: 'test', size: 10 },
    { id: '123' },
    { id: '456' },
    { id: '789' },
    { id: 'john' },
    { id: 'paul' },
    { id: 'george' },
    { id: 'ringo', colour: '#ff0'  }
];
var edges = [ 
    { a: 'foo', b: 'bar' },
    { a: 'foo', b: 'baz' },
    { a: 'foo', b: 'kek' },
    { a: 'bar', b: 'bur' },
    { a: 'baz', b: 'test' },
    { a: 'baz', b: '123' },
    { a: 'baz', b: '456' },
    { a: '123', b: '456' },
    { a: '456', b: '789' },
    { a: 'foo', b: 'john' },
    { a: 'bar', b: 'john' },
    { a: 'baz', b: 'paul' },
    { a: 'paul', b: 'john' },
    { a: 'george', b: 'john' },
    { a: 'ringo', b: 'john' },
    { a: 'ringo', b: 'paul' }
];
