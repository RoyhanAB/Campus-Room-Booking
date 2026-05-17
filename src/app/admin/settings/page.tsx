import { getSystemSettings } from './actions';
import SettingsClient from './SettingsClient';

export const revalidate = 0;

export default async function SettingsPage() {
  const settings = await getSystemSettings();
  return <SettingsClient settings={settings} />;
}
