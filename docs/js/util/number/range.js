Number.prototype.isRange = function(start, end) { [start, end] = [start, end].sort((a, b) => a - b); console.log(start, end, this, this <= end, start <= this); return (this <= end && start <= this) }
Number.prototype.range = function(start, end) { [start, end] = [start, end].sort((a, b) => a - b); return [...Array((end - start) + 1)].map((_, i) => start + i) }
