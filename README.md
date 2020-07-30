# dso.js
A DSO decompiler for Blockland.


## Installation

`npm install @electrk/dso`


## Usage

For client-side, use with the [`buffer`](https://npmjs.com/package/buffer) package.

For server-side, you can just use the native `Buffer` class.


#### Browser Example:

```js
import { Buffer }     from 'buffer/';
import { decompiler } from '@electrk/dso';


// An HTML <input> element with the type "file" and an ID of "fileUpload"
document.getElementById ('fileUpload').onchange = function ( event )
{
	if ( event.target.files.length <= 0 )
	{
		return;
	}

	const file   = event.target.files[0];
	const reader = new FileReader ();

	reader.readAsArrayBuffer (file);

	reader.onload = function ( readerEvent )
	{
		const buffer = Buffer.from (readerEvent.target.result);

		let codeString;

		try
		{
			codeString = decompiler.decompileDSO (buffer);
		}
		catch ( error )
		{
			console.error ('Decompiler Error:', error);
			return;
		}

		console.log (codeString);
	};
};

```


#### Node.js Example:

```js
const fs = require ('fs');

const { decompiler } = require ('@electrk/dso');


fs.readFile ('./myFile.cs.dso', ( error, buffer ) =>
{
	if ( error )
	{
		console.error (error);
		return;
	}

	let codeString;

	try
	{
		codeString = decompiler.decompileDSO (buffer);
	}
	catch ( decompilerError )
	{
		console.error ('[!] Decompiler Error:', decompilerError);
		return;
	}

	fs.writeFileSync ('./myFile.cs', codeString);
});
```


#### Decompiler Options

The optional second argument of `decompileDSO` is an options object.

The only one at the moment is the `outputArray` boolean, which is `false` by default.  When set to `true`, it makes `decompileDSO` output a nested code array instead of a string.

Enable the option like this:

```js
decompiler.decompileDSO (buffer, { outputArray: true });
```
