/* © 2017 int3ractive.com
 * @author Thanh
 */
import PersistStorage from './PersistStorage';

const Store = {
	// default
	states: {
		lastPhotoFetch: 0, // timestamp
		nextPhoto: '',
		currentPhoto: {
			imgUrl:
				'https://images.unsplash.com/photo-1462688681110-15bc88b1497c?dpr=1&auto=compress,format&w=1920&q=80&cs=tinysrgb',
			imgId: 'gzeUpbjoTUA',
			authorName: 'Hoach Le Dinh',
			authorUsername: 'hoachld',
		},
		userPhoto: '',
		settings: {
			language: navigator.language.includes('vi') ? 'vi' : 'en',
			wallpaperMode: 'unsplash', // unsplash or user
			userPhotoName: '', // file name to display at file selector
			// prettier-ignore
			activeQuicklinks: {
				gmail: true, gcalendar: false, gdrive: false, github: false, bitbucket: false, trello: false, facebook: true, twitter: false, gplus: false, tuoitre: false, vnexpress: true, thanhnien: false, gphotos: false, youtube: false, naujukebox: false,
			},
		},
	},

	/**
	 * Rehydrate states from persist storage to running store
	 * @return {Promise} resolve when all
	 */
	rehydrate() {
		return PersistStorage.get(['settings', 'lastPhotoFetch', 'currentPhoto', 'nextPhoto']).then(result => {
			console.log('setting resume', result);
			this.states = Object.assign(this.states, result);
			dispatchEvent('statechange:all', this.states);

			// return whole states object in resolve callback
			return this.states;
		});
	},

	/**
	 * Subscribe to a change in settings
	 * @param  {string} key     Name of settings / key in store
	 * @param  {Function} handler Call back function
	 * @return {void}
	 * @example
	 * ```js
	 * import { Store } from './config';
	 *
	 * Store.subscribe('language', event => {
	 * 	console.log('New language', event.value);
	 * 	this.update();
	 * });
	 * ```
	 */
	subscribe(key, handler) {
		// we'll make use of DOM events for our custom events
		document.addEventListener('statechange:' + key, handler);
	},

	get(key) {
		return this.states[key];
	},

	set(key, value) {
		this.states[key] = value;
		this.save(key);
	},

	save(key) {
		PersistStorage.set({ [key]: this.states[key] }).then(() => {
			this._dispatchEvent('statechange:' + key, { [key]: this.states[key] });
		});
	},

	/**
	 * simple event dispatcher using HTML Events and DOM inspired by Bliss
	 * @param {string} type
	 * @param {any} payload
	 * @return {void}
	 */
	_dispatchEvent(type, payload) {
		const evt = document.createEvent('HTMLEvents');

		evt.initEvent(type, true, true);

		// Return the result of dispatching the event, so we
		// can know if `e.preventDefault` was called inside it
		return document.dispatchEvent(Object.assign(evt, payload));
	},
};

export default Store;