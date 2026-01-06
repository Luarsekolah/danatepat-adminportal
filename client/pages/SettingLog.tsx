import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

const SettingLog: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system-settings');

  const [blockchainSettings, setBlockchainSettings] = useState({
    networkNode: 'peer0.org1.danatepat.com:7051',
    channelName: 'danatepat-channel',
    networkStatus: 'Active',
  });

  const [tokenSettings, setTokenSettings] = useState({
    maxTokenPerTransaction: '1000000',
    tokenExpiryDays: '90',
    dailyMintLimit: '10000000',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    criticalAlerts: true,
    warningAlerts: false,
    infoAlerts: true,
  });

  const [securityLogs, setSecurityLogs] = useState([
    { id: 1, timestamp: '2024-01-15 10:30:23', user: 'admin@danatepat.com', action: 'Login', status: 'Success', ip: '192.168.1.1' },
    { id: 2, timestamp: '2024-01-15 09:15:42', user: 'user@example.com', action: 'Token Transfer', status: 'Success', ip: '192.168.1.25' },
    { id: 3, timestamp: '2024-01-14 16:45:12', user: 'admin@danatepat.com', action: 'Configuration Change', status: 'Success', ip: '192.168.1.1' },
    { id: 4, timestamp: '2024-01-14 14:22:33', user: 'user2@example.com', action: 'Login Attempt', status: 'Failed', ip: '192.168.1.50' },
  ]);

  const handleSave = () => {
    // Implement save logic here
    console.log('Settings saved');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings & Logs</h1>
        <p className="text-gray-600 mt-2">Kelola pengaturan sistem dan audit aktivitas platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <Button 
                  variant={activeTab === 'system-settings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('system-settings')}
                >
                  System Settings
                </Button>
                <Button 
                  variant={activeTab === 'security-logs' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('security-logs')}
                >
                  Security Logs
                </Button>
                <Button 
                  variant={activeTab === 'alerts-notifications' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('alerts-notifications')}
                >
                  Alerts & Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'system-settings' && (
            <div className="space-y-6">
              {/* Blockchain Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Configuration</CardTitle>
                  <CardDescription>Hyperledger Fabric network settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="networkNode">Network Node</Label>
                      <Input
                        id="networkNode"
                        value={blockchainSettings.networkNode}
                        onChange={(e) => setBlockchainSettings({ ...blockchainSettings, networkNode: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="channelName">Channel Name</Label>
                      <Input
                        id="channelName"
                        value={blockchainSettings.channelName}
                        onChange={(e) => setBlockchainSettings({ ...blockchainSettings, channelName: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Network Status</Label>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {blockchainSettings.networkStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Token Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Token Configuration (JAGD)</CardTitle>
                  <CardDescription>Social token parameters and rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="maxTokenPerTransaction">Max Token per Transaction</Label>
                      <Input
                        id="maxTokenPerTransaction"
                        value={tokenSettings.maxTokenPerTransaction}
                        onChange={(e) => setTokenSettings({ ...tokenSettings, maxTokenPerTransaction: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tokenExpiryDays">Token Expiry (Days)</Label>
                      <Input
                        id="tokenExpiryDays"
                        value={tokenSettings.tokenExpiryDays}
                        onChange={(e) => setTokenSettings({ ...tokenSettings, tokenExpiryDays: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dailyMintLimit">Daily Mint Limit</Label>
                      <Input
                        id="dailyMintLimit"
                        value={tokenSettings.dailyMintLimit}
                        onChange={(e) => setTokenSettings({ ...tokenSettings, dailyMintLimit: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Trail Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Audit Trail Information</CardTitle>
                  <CardDescription>
                    Gunakan filter audit log untuk penelusuran jejak data dan memastikan transparansi penuh dalam setiap transaksi yang terjadi di platform Presidana.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <div className="font-semibold text-blue-600">Hyperledger Fabric</div>
                      <div className="text-sm text-gray-500 mt-1">Distributed Ledger Technology</div>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <div className="font-semibold text-green-600">Immutable Records</div>
                      <div className="text-sm text-gray-500 mt-1">Tamper-proof data storage</div>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <div className="font-semibold text-purple-600">Full Transparency</div>
                      <div className="text-sm text-gray-500 mt-1">Complete audit trail visibility</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security-logs' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Logs</CardTitle>
                <CardDescription>Audit aktivitas keamanan sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari log..."
                      className="pl-10 w-full md:w-[300px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      Ekspor
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Timestamp</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {securityLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{log.timestamp}</td>
                            <td className="px-4 py-3 text-sm">{log.user}</td>
                            <td className="px-4 py-3 text-sm">{log.action}</td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={log.status === 'Success' ? 'default' : 'destructive'}
                                className={
                                  log.status === 'Success'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                                }
                              >
                                {log.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">{log.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'alerts-notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Alerts & Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications" className="font-normal">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications" className="font-normal">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotifications" className="font-normal">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive SMS notifications</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Alert Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="criticalAlerts" className="font-normal">Critical Alerts</Label>
                        <p className="text-sm text-gray-500">System critical alerts</p>
                      </div>
                      <Switch
                        id="criticalAlerts"
                        checked={notificationSettings.criticalAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, criticalAlerts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="warningAlerts" className="font-normal">Warning Alerts</Label>
                        <p className="text-sm text-gray-500">System warning alerts</p>
                      </div>
                      <Switch
                        id="warningAlerts"
                        checked={notificationSettings.warningAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, warningAlerts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="infoAlerts" className="font-normal">Information Alerts</Label>
                        <p className="text-sm text-gray-500">General information alerts</p>
                      </div>
                      <Switch
                        id="infoAlerts"
                        checked={notificationSettings.infoAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, infoAlerts: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingLog;