import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

type Deposit = { id: number; depositor: string; amount: number; currency: string; providerFee: number; date: string };

const SAMPLE_DEPOSITS: Deposit[] = [
  { id: 1, depositor: 'Acme Corp', amount: 2500, currency: 'USD', providerFee: 25, date: '2025-10-28' },
  { id: 2, depositor: 'BlueFin Ltd', amount: 750, currency: 'GBP', providerFee: 7.5, date: '2025-10-27' },
  { id: 3, depositor: 'Jane Doe', amount: 1800, currency: 'EUR', providerFee: 30, date: '2025-10-26' },
  { id: 4, depositor: 'RedRock LLC', amount: 12000, currency: 'USD', providerFee: 150, date: '2025-10-25' },
];

function Amount({ amount, currency }: { amount: number; currency: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{currency} {amount.toLocaleString()}</span>
  {amount > 1000 ? <Chip label="Large" size="small" className="bg-amber-100 text-amber-800" /> : null}
    </div>
  );
}

export default function DepositsList() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h5">Deposits</Typography>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Recent deposits to monitored accounts</div>
          </div>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Depositor</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Provider fee</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SAMPLE_DEPOSITS.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.depositor}</TableCell>
                    <TableCell><Amount amount={d.amount} currency={d.currency} /></TableCell>
                    <TableCell>{d.currency}</TableCell>
                    <TableCell>{d.currency} {d.providerFee.toLocaleString()}</TableCell>
                    <TableCell>{d.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
