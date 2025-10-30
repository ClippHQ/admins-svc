// next/link not used here
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

export default function ApplicationDetail() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#111318] dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-white font-bold">CP</div>
            <div>
              <h2 className="text-lg font-bold">Compliance Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <input placeholder="Search users..." className="rounded-md border border-zinc-200 px-3 py-2 dark:bg-zinc-800" />
            </div>
            <div className="flex gap-2">
              <button className="rounded-md bg-gray-100 dark:bg-gray-800 p-2"><span className="material-symbols-outlined">notifications</span></button>
              <button className="rounded-md bg-gray-100 dark:bg-gray-800 p-2"><span className="material-symbols-outlined">help</span></button>
            </div>
            <Avatar className="bg-sky-600">C</Avatar>
          </div>
        </header>

        <main className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Profile header */}
          <section className="col-span-1 md:col-span-12 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="flex gap-4 items-center">
              <div className="h-24 w-24 rounded-full bg-cover bg-center" style={{backgroundImage: 'url(https://via.placeholder.com/150)'}} />
              <div>
                <p className="text-2xl font-bold">James Smith</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer ID: 84321</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-zinc-500">Status:</span>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-600">Pending KYC Verification</span>
                </div>
              </div>
            </div>

            <div className="flex w-full max-w-md gap-3 md:w-auto">
              <Button fullWidth variant="outlined" color="inherit">Reject</Button>
              <Button fullWidth variant="contained" className="bg-primary hover:bg-[#0f4fd1]">Approve Application</Button>
            </div>
          </section>

          {/* Left column */}
          <aside className="col-span-1 md:col-span-3 flex flex-col gap-6">
            <Card className="shadow-sm">
              <CardContent>
                <Typography variant="h6">User Overview</Typography>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-zinc-500">Email:</span><span className="font-medium">james.smith@email.com</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Phone:</span><span className="font-medium">+1 234 567 8900</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Registered:</span><span className="font-medium">2023-10-26</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Last Login:</span><span className="font-medium">2024-03-15</span></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-500">Risk Level:</span><span className="inline-flex items-center rounded-full bg-red-100 px-2 text-xs font-medium text-red-600">High</span></div>
                </div>
              </CardContent>
            </Card>

            <Button fullWidth variant="outlined" className="text-primary! border-primary!">
              <span className="material-symbols-outlined mr-2">email</span>
              Request More Information
            </Button>
          </aside>

          {/* Center column */}
          <section className="col-span-1 md:col-span-6">
            <Card className="shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6 px-6">
                  <a className="border-b-2 border-primary text-primary py-4 px-1 text-sm font-medium">Application Details</a>
                  <a className="text-zinc-500 hover:text-zinc-700 py-4 px-1 text-sm font-medium">Linked Bank Accounts</a>
                  <a className="text-zinc-500 hover:text-zinc-700 py-4 px-1 text-sm font-medium">Transaction History</a>
                </nav>
              </div>
              <CardContent>
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-zinc-500">First Name</p>
                    <p className="font-medium">James</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Last Name</p>
                    <p className="font-medium">Smith</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Date of Birth</p>
                    <p className="font-medium">1985-05-12</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Nationality</p>
                    <p className="font-medium">American</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-zinc-500">Address</p>
                    <p className="font-medium">123 Market St, Suite 450, San Francisco, CA 94103, USA</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Employment Status</p>
                    <p className="font-medium">Employed</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Occupation</p>
                    <p className="font-medium">Software Engineer</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-zinc-500">Source of Funds</p>
                    <p className="font-medium">Salary &amp; Investments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Right column */}
          <aside className="col-span-1 md:col-span-3 flex flex-col gap-6">
            <Card className="shadow-sm">
              <CardContent>
                <Typography variant="h6">Documents</Typography>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                      <span className="text-sm font-medium">Passport_ID.pdf</span>
                    </div>
                    <a className="text-sm font-bold text-primary" href="#">View</a>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                      <span className="text-sm font-medium">Proof_of_Address.pdf</span>
                    </div>
                    <a className="text-sm font-bold text-primary" href="#">View</a>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                      <span className="text-sm font-medium">Bank_Statement_Dec.pdf</span>
                    </div>
                    <a className="text-sm font-bold text-primary" href="#">View</a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent>
                <Typography variant="h6">Audit Trail</Typography>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-cover" style={{backgroundImage: 'url(https://via.placeholder.com/64)'}} />
                    <div>
                      <p className="text-sm"><strong>Sarah Jenkins</strong> changed status to <span className="text-yellow-600">Pending KYC</span>.</p>
                      <p className="text-xs text-zinc-500">2024-03-15 10:45 AM</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-cover" style={{backgroundImage: 'url(https://via.placeholder.com/64)'}} />
                    <div>
                      <p className="text-sm"><strong>Mark Johnson</strong> added a note.</p>
                      <p className="text-xs text-zinc-500">2024-03-14 02:12 PM</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-600">robot_2</span>
                    </div>
                    <div>
                      <p className="text-sm"><strong>System</strong> created user account.</p>
                      <p className="text-xs text-zinc-500">2024-03-14 09:00 AM</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
}
