Array.prototype.flatten = function(this: any[]) {
    return [].concat.apply([], this);
};
