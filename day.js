module.exports.getDay = () => {
    var today = new Date();
    var options = {
        weekday: 'long',
    }
    return today.toLocaleString('en-US', options);
}

module.exports.getDate = () => {
    var today = new Date();
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return today.toLocaleString('en-US', options);
};