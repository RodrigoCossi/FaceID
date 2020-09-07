const loadNets = require('./loadmodels-mock')

test('if nets load', () => {
    return loadNets().then((values)=>{
        expect(values).toEqual([
            "net one loaded",
            "net two loaded",
            "net three loaded",
            "net four loaded",
            "net five loaded",
            "net six loaded"
        ])
    })
});