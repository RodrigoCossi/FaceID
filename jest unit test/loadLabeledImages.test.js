const functions = require('./loadLabeledImages-mock')


test('if labels are loaded', async () => {
    let allDescriptors = await functions.loadLabeledImages()
    expect(allDescriptors).toEqual([
        "descriptors",
        "descriptors",
        "descriptors",
        "descriptors",
        "descriptors",
        "descriptors"
    ])
})