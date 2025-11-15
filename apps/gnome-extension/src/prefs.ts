import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import {
  ExtensionPreferences,
  gettext as _,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class CloudClipboardPreferences extends ExtensionPreferences {
  _settings?: Gio.Settings;

  fillPreferencesWindow(window: Adw.PreferencesWindow): Promise<void> {
    this._settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title: _('General'),
      iconName: 'dialog-information-symbolic',
    });

    const clipboardGroup = new Adw.PreferencesGroup({
      title: _('Cloud Clipboard'),
      description: _('Configure backend connection'),
    });
    page.add(clipboardGroup);

    const backendUrl = new Adw.EntryRow({
      title: _('Backend URL'),
    });
    clipboardGroup.add(backendUrl);

    const userKey = new Adw.EntryRow({
      title: _('User Key'),
    });
    clipboardGroup.add(userKey);

    window.add(page);

    // Bind settings
    this._settings.bind('backend-url', backendUrl, 'text', Gio.SettingsBindFlags.DEFAULT);
    this._settings.bind('user-key', userKey, 'text', Gio.SettingsBindFlags.DEFAULT);

    return Promise.resolve();
  }
}
