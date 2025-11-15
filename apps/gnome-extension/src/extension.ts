import GLib from 'gi://GLib';
import type Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Soup from 'gi://Soup';
import St from 'gi://St';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class CloudClipboardExtension extends Extension {
  gsettings?: Gio.Settings;
  backendUrl = '';
  userKey = '';
  lastContent = '';
  clipboard?: St.Clipboard;
  selection?: Meta.Selection;
  _selectionOwnerChangedId?: number;

  enable() {
    this.gsettings = this.getSettings();
    this.backendUrl = this.gsettings.get_string('backend-url');
    this.userKey = this.gsettings.get_string('user-key');
    this.lastContent = '';

    this.clipboard = St.Clipboard.get_default();
    this.selection = global.get_display().get_selection();
    this._selectionOwnerChangedId = this.selection.connect('owner-changed', (_, selectionType) => {
      if (
        selectionType === Meta.SelectionType.SELECTION_CLIPBOARD ||
        selectionType === Meta.SelectionType.SELECTION_PRIMARY
      ) {
        this._onClipboardChanged();
      }
    });

    console.log('CloudClipboardExtension: Enabled');
  }

  disable() {
    if (this.selection && this._selectionOwnerChangedId !== undefined) {
      this.selection.disconnect(this._selectionOwnerChangedId);
      this._selectionOwnerChangedId = undefined;
    }
    this.selection = undefined;
    this.clipboard = undefined;
    this.gsettings = undefined;

    console.log('CloudClipboardExtension: Disabled');
  }

  _setupSelectionChangeListener() {
    this.selection = global.get_display().get_selection();
  }

  _onClipboardChanged() {
    if (!this.clipboard) return;
    console.log('CloudClipboardExtension: Clipboard changed');

    this.clipboard.get_text(St.ClipboardType.CLIPBOARD, (clip, text) => {
      if (text && text !== this.lastContent) {
        console.log('CloudClipboardExtension: Clipboard content changed');
        this.lastContent = text;
        this._sendToBackend(text);
      }
    });
  }

  _sendToBackend(content: string) {
    const session = new Soup.Session();
    const message = Soup.Message.new('POST', this.backendUrl + '/api/clipboard');
    message.set_request_body_from_bytes(
      'application/json',
      new GLib.Bytes(new TextEncoder().encode(JSON.stringify({ content }))),
    );
    message.request_headers.append('X-User-Key', this.userKey);
    session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (session, result) => {
      try {
        if (!session) throw new Error('No session available');

        const bytes = session.send_and_read_finish(result);
        const data = bytes.get_data();
        if (!data) throw new Error('No data received from backend');

        const response = new TextDecoder().decode(data);
        console.log('Sent clipboard to backend:', response);
      } catch (e) {
        console.error('Failed to send clipboard to backend:', e);
      }
    });
  }
}
