import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { Account } from "@/data/accounts";

interface AccountManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onUpdateAccounts: (accounts: Account[]) => void;
}

export default function AccountManageModal({
  isOpen,
  onClose,
  accounts,
  onUpdateAccounts,
}: AccountManageModalProps) {
  const toggleAccountVisibility = (accountId: string) => {
    const updatedAccounts = accounts.map((account) =>
      account.id === accountId
        ? { ...account, isVisible: !account.isVisible }
        : account
    );
    onUpdateAccounts(updatedAccounts);
  };

  const liveAccounts = accounts.filter((account) => account.type === 'live');
  const demoAccounts = accounts.filter((account) => account.type === 'demo');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Accounts</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            defaultValue="live"
            className="w-full flex-1 flex flex-col"
          >
            <TabsList className="w-full">
              <TabsTrigger value="live" className="flex-1">
                Live Accounts
              </TabsTrigger>
              <TabsTrigger value="demo" className="flex-1">
                Demo Accounts
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="live">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Account Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>
                          ${account.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.isActive ? 'default' : 'secondary'}>
                            {account.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={account.isVisible}
                            onCheckedChange={() =>
                              toggleAccountVisibility(account.id)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="demo">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Account Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>
                          ${account.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.isActive ? 'default' : 'secondary'}>
                            {account.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={account.isVisible}
                            onCheckedChange={() =>
                              toggleAccountVisibility(account.id)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 