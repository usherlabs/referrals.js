# UsherJS: Browser JS Conversion Tracking Library

This library **does not work in Node.js environments**. It is designed for web browsers **only** (*for now*). You should ensure that your application does not attempt to package and run this on a server.

## Getting Started

```
npm i @usher.so/js
```
OR
```
yarn add @usher.so/js
```

Using Import:
```javascript
import { Usher } from '@usher.so/js'
Usher('convert', {
	id: "ida4Pebl2uULdI_rN8waEw65mVH9uIFTY1JyeZt1PBM",
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
<script src="https://cdn.jsdelivr.net/npm/@usher.so/js"></script>
<script>
	window.Usher('convert', {
		id: "ida4Pebl2uULdI_rN8waEw65mVH9uIFTY1JyeZt1PBM",
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

- Integrate UsherJS: [https://docs.usher.so](https://docs.usher.so)
- UsherJS Typescript Docs: [https://ts-docs.js.usher.so](https://ts-docs.js.usher.so)
- View integration example: [See file](https://github.com/usherlabs/usher.js/blob/master/tools/index.html)
- Learn about Usher: [https://usher.so](https://usher.so)

## API

### `window.Usher(name, params)`

**returns:** `void`
|Argument|Type|Description
`name`|string|A string to indicate the event to execute, or the callback to register
`params`|Object OR Function|For events that execute, pass an Object. For callbacks, pass a Function.

## Event Types

### `convert`

Use this event name with `window.Usher` to trigger a conversion.

**params:** `Conversion` -- [See Type](https://ts-docs.js.usher.so/types/types.conversion)

### `onLoad`

**params:** `() => void`

### `onConversion`

**params:** `ConversionCallback` -- [See Type](https://ts-docs.js.usher.so/types/types.conversioncallback)

Register a callback to fire after a conversion has been successfully tracked.

```javascript
Usher('onConversion', (conversion) => {
	console.log(conversion)
	responseEl.innerHTML += "<p>I've converted a user</p>";
})
```
