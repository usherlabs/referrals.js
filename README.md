# Usher Satellite: Browser JS Conversion Tracking Library

This library **does not work in Node.js environments**. It is designed for web browsers **only** (*for now*). You should ensure that your application does not attempt to package and run this on a server.

## Getting Started

```
npm i @usher.so/satellite
```
OR
```
yarn add @usher.so/satellite
```

Using Import:
```javascript
import { Usher } from '@usher.so/satellite'
Usher('convert', {
	id: "ida4Pebl2uULdI_rN8waEw65mVH9uIFTY1JyeZt1PBM__6",
	chain: "arweave",
	eventId: 0,
	commit: 10,
	// nativeId: "world",
	metadata: {
		hello: "world",
		"key": "value"
	}
});
```

Loading directly into Browser:
```html
<script src="https://cdn.jsdelivr.net/npm/@usher.so/satellite"></script>
<script>
	window.Usher('convert', {
		id: "ida4Pebl2uULdI_rN8waEw65mVH9uIFTY1JyeZt1PBM__6",
		chain: "arweave",
		eventId: 1,
		nativeId: "some_wallet_address",
		metadata: {
			"convert_type": "defi",
			"action": "stake",
			"amount": 10000
		}
	});
</script>
```

## Documentation

- Integrate Usher Satellite: [https://docs.usher.so](https://docs.usher.so)
- View integration example: [See file](https://github.com/usherlabs/satellite/blob/master/tools/index.html)
- Learn about Usher: [https://usher.so](https://usher.so)

## API

### `window.Usher(name, params)`

**returns:** `void`
|Argument|Type|Description
`name`|string|A string to indicate the event to execute, or the callback to register
`params`|Object OR Function|For events that execute, pass an Object. For callbacks, pass a Function.

## Event Types

### `convert`

`**params:** [Conversion]()`

### `onLoad`

`**params:** () => void`
