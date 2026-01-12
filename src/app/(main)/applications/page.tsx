import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

type AppItem = {
  id: number;
  name: string;
  currencies: string;
  submitted: string;
  status: 'approved' | 'rejected' | 'pending' | string;
};

const SAMPLE: AppItem[] = [
  { id: 1, name: 'Acme Corp', currencies: 'USD, EUR', submitted: '2025-10-28', status: 'pending' },
  { id: 2, name: 'BlueFin Ltd', currencies: 'GBP', submitted: '2025-10-27', status: 'approved' },
  { id: 3, name: 'RedRock LLC', currencies: 'USD', submitted: '2025-10-26', status: 'rejected' },
  { id: 4, name: 'GreenTree', currencies: 'EUR, GBP', submitted: '2025-10-25', status: 'under_review' },
];

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === 'approved') return <Chip label="Approved" size="small" className="bg-emerald-100 text-emerald-800" />;
  if (s === 'rejected') return <Chip label="Rejected" size="small" className="bg-red-100 text-red-800" />;
  // fallback: yellow-brown for other statuses
  return <Chip label={status.replace('_', ' ')} size="small" className="bg-amber-100 text-amber-800" />;
}

export default function ApplicationsList() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h5">Applications</Typography>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">List of submitted account applications</div>
          </div>
 
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SAMPLE.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.currencies}</TableCell>
                    <TableCell>{a.submitted}</TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Link href={`/applications/view/${a.id}`}>
                        <p className="text-sky-600">Open</p>
                      </Link>
                    </TableCell>
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
