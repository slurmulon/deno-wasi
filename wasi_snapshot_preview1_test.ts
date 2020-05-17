import {
	assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

import {
	Context,
	args_get,
	args_sizes_get,
	environ_get,
	environ_sizes_get,
	clock_res_get,
	clock_time_get,
	fd_advise,
	fd_allocate,
	fd_close,
	fd_datasync,
	fd_fdstat_get,
	fd_fdstat_set_flags,
	fd_fdstat_set_rights,
	fd_filestat_get,
	fd_filestat_set_size,
	fd_filestat_set_times,
	fd_pread,
	fd_prestat_get,
	fd_prestat_dir_name,
	fd_pwrite,
	fd_read,
	fd_readdir,
	fd_renumber,
	fd_seek,
	fd_sync,
	fd_tell,
	fd_write,
	path_create_directory,
	path_filestat_get,
	path_filestat_set_times,
	path_link,
	path_open,
	path_readlink,
	path_remove_directory,
	path_rename,
	path_symlink,
	path_unlink_file,
	poll_oneoff,
	proc_exit,
	proc_raise,
	sched_yield,
	random_get,
	sock_recv,
	sock_send,
	sock_shutdown,
} from "./wasi_snapshot_preview1.ts";

Deno.test("args_get", function() : void {
	const context : Context = {
		memory: new WebAssembly.Memory({ initial: 1 }),
	};

	const text = new TextDecoder();
	const heap = new Uint8Array(context.memory.buffer);
	const view = new DataView(context.memory.buffer);

	assertEquals(args_get.call(context, 0, 4), 0);
	assertEquals(view.getUint32(0, true), 0);
	assertEquals(view.getUint32(4, true), 0);

	context.args = [];
	assertEquals(args_get.call(context, 0, 4), 0);
	assertEquals(view.getUint32(0, true), 0);
	assertEquals(view.getUint32(4, true), 0);

	context.args = ["one"];
	assertEquals(args_get.call(context, 0, 4), 0);
	assertEquals(view.getUint32(0, true), 4);
	assertEquals(text.decode(new Uint8Array(context.memory.buffer, 4, 4)), "one\0");

	context.args = ["one", "two"];
	assertEquals(args_get.call(context, 0, 8), 0);
	assertEquals(view.getUint32(0, true), 8);
	assertEquals(view.getUint32(4, true), 12);
	assertEquals(text.decode(new Uint8Array(context.memory.buffer, 8, 4)), "one\0");
	assertEquals(text.decode(new Uint8Array(context.memory.buffer, 12, 4)), "two\0");

	context.args = ["one", "two", "three"];
	assertEquals(args_get.call(context, 0, 12), 0);
	assertEquals(view.getUint32(0, true), 12);
	assertEquals(view.getUint32(4, true), 16);
	assertEquals(view.getUint32(8, true), 20);
	assertEquals(text.decode(new Uint8Array(context.memory.buffer, 12, 4)), "one\0");
	assertEquals(text.decode(new Uint8Array(context.memory.buffer, 16, 4)), "two\0");
	assertEquals(text.decode(new Uint8Array(context.memory.buffer, 20, 6)), "three\0");
});

Deno.test("args_sizes_get", function() : void {
	const context : Context = {
		memory: new WebAssembly.Memory({ initial: 1 }),
	};

	const view = new DataView(context.memory.buffer);

	assertEquals(args_sizes_get.call(context, 0, 4), 0);
	assertEquals(view.getUint32(0, true), 0);
	assertEquals(view.getUint32(0, true), 0);

	context.args = [];
	assertEquals(args_sizes_get.call(context, 0, 4), 0);
	assertEquals(view.getUint32(0, true), 0);
	assertEquals(view.getUint32(0, true), 0);

	context.args = ["one"];
	assertEquals(args_sizes_get.call(context, 0, 4), 0);
	assertEquals(view.getUint32(0, true), 1);
	assertEquals(view.getUint32(4, true), 4);

	context.args = ["one", "two"];
	assertEquals(args_sizes_get.call(context, 0, 4), 0);
	assertEquals(view.getUint32(0, true), 2);
	assertEquals(view.getUint32(4, true), 8);

	context.args = ["one", "two", "three"];
	assertEquals(args_sizes_get.call(context, 0, 4), 0);
	assertEquals(view.getUint32(0, true), 3);
	assertEquals(view.getUint32(4, true), 14);
});
