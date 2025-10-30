import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function DashboardPage() {
  const stats = [
    { label: 'Pending Applications', value: 24, color: 'bg-amber-100' },
    { label: 'Deposits > $1,000', value: 7, color: 'bg-emerald-100' },
    { label: 'Active Accounts', value: 1284, color: 'bg-sky-100' },
  ];

  const recent = [
    { id: 1, who: 'Acme Corp', action: 'Applied for USD/EUR account', time: '2 hours ago' },
    { id: 2, who: 'BlueFin Ltd', action: 'Deposit $2,500 (GBP)', time: '5 hours ago' },
    { id: 3, who: 'Jane Doe', action: 'KYC documents uploaded', time: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-2">
            <div className="sticky top-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-sky-600 flex items-center justify-center text-white font-bold">CP</div>
                <div>
                  <Typography variant="subtitle1" component="div">Compliance</Typography>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">Portal</div>
                </div>
              </div>

              <nav className="mt-6 flex flex-col gap-2">
                <Link href="/" className="rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">Dashboard</Link>
                <Link href="/applications" className="rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">Applications</Link>
                <Link href="/deposits" className="rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">Deposits</Link>
                <Link href="/auth/signin" className="rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">Sign out</Link>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-span-12 md:col-span-10">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h5" component="h1">Dashboard</Typography>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Overview of applications, deposits and account activity</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <input placeholder="Search applications" className="rounded-md border border-zinc-200 px-3 py-2 dark:bg-zinc-800" />
                </div>
                <Avatar className="bg-sky-600">C</Avatar>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {stats.map((s) => (
                <Card key={s.label} className="shadow-sm">
                  <CardContent>
                    <div className={`flex items-center justify-between gap-4 ${s.color} rounded-md p-3`}>
                      <div>
                        <Typography variant="subtitle2" className="text-zinc-600 dark:text-zinc-300">{s.label}</Typography>
                        <Typography variant="h6" component="div" className="mt-1">{s.value}</Typography>
                      </div>
                      <div>
                        <IconButton size="small"><MoreVertIcon /></IconButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <Card className="shadow-sm">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Typography variant="h6">Recent activity</Typography>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Showing latest 10</div>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Who</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell>When</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recent.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell>{r.who}</TableCell>
                            <TableCell>{r.action}</TableCell>
                            <TableCell>{r.time}</TableCell>
                            <TableCell align="right">
                              <Link href={`/applications/${r.id}`} className="text-sky-600">Open</Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
