# Largo
Nodejs version 8.12.0

Transcribe

mongoose/lib/query.js 변경해야함 2044 line count Depricated

this._collection.count(conds, options, utils.tick(callback));
=> this._collection.collection.countDocuments(conds, options, utils.tick(callback));