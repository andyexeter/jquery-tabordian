QUnit.test("set integer", function( assert ) {
	
	store.set('testItem', 1);
	
	assert.strictEqual(store.get('testItem'), 1, "Passed!");
	
	store.clear();
});

QUnit.test("set string", function( assert ) {
	
	store.set('testItem', 'test');
	
	assert.strictEqual(store.get('testItem'), 'test', "Passed!");
	
	store.clear();
});

QUnit.test("set boolean", function( assert ) {
	
	store.set('testItem', true);
	
	assert.strictEqual(store.get('testItem'), true, "Set true Passed!");
	
	store.set('testItem2', false);
	
	assert.strictEqual(store.get('testItem2'), false, "Set false Passed!");
	
	store.clear();
	
});

QUnit.test("set object", function( assert ) {
	
	var obj = {a: true, b: "Hello World", c: 0}
	
	store.set('testItem', obj);
	
	assert.deepEqual(store.get('testItem'), {a: true, b: "Hello World", c: 0}, "Passed!");
	
	store.clear()
});

QUnit.test("set array", function( assert ) {
	
	var array = [1,2,3];
	
	store.set('testItem', array);
	
	assert.deepEqual(store.get('testItem'), [1,2,3], "Passed!");
	
	store.clear();
});

QUnit.test("push object", function( assert ) {
	
	var obj = {a: true, b: "Hello World", c: 0}
	
	store.set('testItem', obj);
	store.push('testItem', {d: false});
	
	assert.deepEqual(store.get('testItem'), {a: true, b: "Hello World", c: 0, d: false}, "Push object Passed!");
	
	store.push('testItem', 'e', []);
	
	assert.deepEqual(store.get('testItem'), {a: true, b: "Hello World", c: 0, d: false, e: []}, "Push key/value Passed!");
	
	store.clear();
});

QUnit.test("pop object", function( assert ) {
	
	var obj = {a: true, b: "Hello World", c: 0}
	
	store.set('testItem', obj);
	store.pop('testItem', 'c');
	
	assert.deepEqual(store.get('testItem'), {a: true, b: "Hello World"}, "Passed!");
	
	store.clear();
});

QUnit.test("push array", function( assert ) {
	
	store.set('testItem', [1,2,3]);
	store.push('testItem', 4);
	
	assert.deepEqual(store.get('testItem'), [1,2,3,4], "Passed!");
	
	store.clear();
});

QUnit.test("pop array", function( assert ) {
	
	store.set('testItem', [1,2,3,4]);
	store.pop('testItem');
	
	assert.deepEqual(store.get('testItem'), [1,2,3], "Passed!");
	
	store.clear();
});

QUnit.test("set storage type", function( assert ) {
	
	store.storage(localStorage);
	
	assert.strictEqual(store.storage(), 'localStorage', "localStorage Passed!");	
	
	store.storage(sessionStorage);
	
	assert.strictEqual(store.storage(), 'sessionStorage', "sessionStorage Passed!");
	
});