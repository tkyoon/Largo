# Largo [Transcribe] Nodejs version 8.12.0







#### MongoDB Unique 설정
* tb_user create index
 
```
	pilsa.tb_user.createIndex( { userId: 1, socialType : 1 }, { unique: true } )
```

* tb_transcribe create index
 
```
	pilsa.tb_transcribe.createIndex( { postId : 1, regId : 1 }, { unique: true } )
```







#### 소스 수정해야 할 부분
* /node_models/mongoose/lib/query.js 변경해야함 2044 line count Depricated


```javascript
	this._collection.count(conds, options, utils.tick(callback));

	=> this._collection.collection.countDocuments(conds, options, utils.tick(callback));