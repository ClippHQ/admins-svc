
"use client";

import { Alert, Box, Button, Chip, CircularProgress, Container, Divider, Grid, Paper, Snackbar, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useConfirmRejectDepositMtn, useDeposit } from "src/api/deposit";
import { Deposit } from "src/types";

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { format } from "date-fns";
import { formatAmount } from "src/lib/amount";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTransactions } from "src/api/transactions";
import { GenericTableGenerator } from "src/components/generic-table-generator";
import Link from "next/link";

function AlertDialog({open, onConfirm, onCancel, message, title = "Confirm Action"}: {open: boolean; onConfirm: () => void; onCancel: () => void; message: string; title?: string}) {




  return (


      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Disagree</Button>
          <Button onClick={onConfirm} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

  );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function DepositStatus({ deposit }: { deposit: Deposit }) {
    const color: React.ComponentProps<typeof Chip>['color'] = React.useMemo(() => {
        switch (deposit?.status) {
            case 'pending':
            case 'in_review':
                return 'warning';
            case 'successful':
            case 'confirmed':
                return 'success';
            case 'failed':
            case 'rejected':
                return 'error';
            default:
                return 'default';

        }

    }, [deposit?.status]);

    return (
        <Chip label={deposit?.status ?? 'No Status'} color={color} />
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}





export default function DepositDetailsPage() {
    const params = useParams();
    const [value, setValue] = React.useState(0);
    const { data: deposit, status, error, refetch: refetchDeposit } = useDeposit(params?.id as string);
    const confirmRejectDepositMtn = useConfirmRejectDepositMtn()
    const [action, setAction] = React.useState<'confirm' | 'reject' | 'none'>('none')
    const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false)
    const [snackbarAction, setSnackbarAction] = React.useState<'error' | 'success' | 'none'>('none')
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const infiniteData = useTransactions({limit: 10, wallet_id: deposit?.deposit?.wallet_id ?? ''})

    


    const loading = status === 'pending'
    const errorMessage = status === 'error' ? error?.message || "An unexpected error occurred" : null;

    const address = React.useMemo(() => {
        if (!deposit?.kyc_verification) return '-';
        const addressArray = [deposit.kyc_verification.address_street ?? '', deposit.kyc_verification.address_street_2 ?? '', deposit.kyc_verification.address_city ?? '', deposit.kyc_verification.address_state ?? '', deposit.kyc_verification.address_zip ?? '', deposit.kyc_verification.address_country ?? ''].filter(item => item.length > 0);
        console.log(addressArray, deposit.kyc_verification)
        return addressArray.join(', ') ?? '-';
        
    }, [deposit?.kyc_verification])

    function confirmRejectDeposit() { 
        setAlertDialogOpen(false);
        if (action === 'none' || !params?.id) return;
        confirmRejectDepositMtn.mutate({ deposit_id: params.id as string,  action: action, reason: `Admin ${action}ed deposit on ` + new Date().toISOString()}, {
            onError: (error) => {
                console.error("Error confirming/rejecting deposit:", error);
                setSnackbarAction('error');
                setSnackbarOpen(true);
            },
            onSuccess: (data) => {
                console.log("Successfully confirmed/rejected deposit:", data);
                setSnackbarAction('success');
                setSnackbarOpen(true);
                refetchDeposit();

            }
        });

    }

    const openAlertDialog = (actionType: 'confirm' | 'reject') => {
        setAction(actionType);
        setAlertDialogOpen(true);
    }
    return (
        <div>
            <h1>Deposit Details for ID: {params?.id || 'undefined'}</h1>

            <Container>
                {loading && (
                    <div className="flex justify-center py-12">
                        <CircularProgress />
                    </div>
                )}
                <Paper style={{
                    padding: '16px'
                }}>
                    <Box display="flex" flexDirection="column" rowGap="16px">
                        <Typography variant="h4">User Info</Typography>

                        <Grid container>
                            <Grid size={4} >
                                <Typography variant="subtitle2">Name</Typography>
                                <Typography textTransform="capitalize" variant="body1" fontWeight="bold">{`${deposit?.profile?.name_first} ${deposit?.profile?.name_last}`}</Typography>
                            </Grid>
                            <Grid size={4} >
                                <Typography variant="subtitle2">Email</Typography>
                                <Typography variant="body1" fontWeight="bold">{deposit?.profile?.email}</Typography>
                            </Grid>
                            <Grid size={4} >
                                <Typography variant="subtitle2">Phone Number</Typography>
                                <Typography variant="body1" fontWeight="bold">{deposit?.profile?.phone_prefix} {deposit?.profile?.phone}</Typography>
                            </Grid>
                        </Grid>


                        <Grid container>
                            <Grid size={4} >
                                <Typography variant="subtitle2">Registered At</Typography>
                                <Typography variant="body1" fontWeight="bold">{format(deposit?.profile?.created_at || new Date(), "dd MMM, yyyy")}</Typography>
                            </Grid>
             
                                     <Grid size={4} >
                                <Typography variant="subtitle2">Address</Typography>
                                <Typography variant="body1" fontWeight="bold">{address}</Typography>
                            </Grid>

                        </Grid>

                     {!!deposit?.profile?.user_id && (   <Link href={`/profiles/${deposit?.profile?.user_id}`}>
                            <Button variant="outlined">
                                View Full Profile
                            </Button>
                        </Link>)}

                 <Divider />
                    </Box>


   

                    <Box marginTop="16px" display="flex" flexDirection="column" rowGap="16px">
                        <Typography variant="h4">Deposit Info</Typography>

                        <Box>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Deposit Details" {...a11yProps(0)} />
                                    <Tab label="Transaction History" {...a11yProps(1)} />
                                    {/* TODO add tab for account balance  */}

                                </Tabs>
                            </Box>

                            <CustomTabPanel value={value} index={0}>
                                <Box display="flex" flexDirection="column" rowGap="16px">
                                    <Grid container>
                                        <Grid size={4} >
                                            <Typography variant="subtitle2">Date</Typography>
                                            <Typography textTransform="capitalize" variant="body1" fontWeight="bold">{format(deposit?.deposit?.created_at || new Date(), "dd MMM, yyyy. HH:mm")}</Typography>
                                        </Grid>
                                        <Grid size={4} >
                                            <Typography variant="subtitle2">Currency</Typography>
                                            <Typography variant="body1" fontWeight="bold">{deposit?.deposit?.currency || '-'}</Typography>
                                        </Grid>
                                        <Grid size={4} >
                                            <Typography variant="subtitle2">Amount</Typography>
                                            <Typography variant="body1" fontWeight="bold">{formatAmount({
                                                amount: deposit?.deposit?.amount ? deposit?.deposit?.amount / 100 : 0,
                                                withDecimals: true,
                                                currency: deposit?.deposit?.currency ?? 'USD',
                                            })}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid size={4} >
                                            <Typography variant="subtitle2">Fee</Typography>
                                            <Typography variant="body1" fontWeight="bold">{formatAmount({
                                                amount: deposit?.deposit?.fee ? deposit?.deposit?.fee / 100 : 0,
                                                withDecimals: true,
                                                currency: deposit?.deposit?.currency ?? 'USD',
                                            })}</Typography>
                                        </Grid>
                                        <Grid size={4} >
                                            <Typography variant="subtitle2">Provider Fee</Typography>
                                            <Typography variant="body1" fontWeight="bold">{deposit?.deposit?.provider_fee !== undefined ? formatAmount({
                                                amount: deposit?.deposit?.provider_fee ? deposit?.deposit?.provider_fee / 100 : 0,
                                                withDecimals: true,
                                                currency: deposit?.deposit?.currency ?? 'USD',
                                            }) : '-'}</Typography>
                                        </Grid>
                                        <Grid size={4} >
                                            <Typography variant="subtitle2">Amount Settled</Typography>
                                            <Typography variant="body1" fontWeight="bold">{formatAmount({
                                                amount: deposit?.deposit?.amount_settled ? deposit?.deposit?.amount_settled / 100 : 0,
                                                withDecimals: true,
                                                currency: deposit?.deposit?.currency ?? 'USD',
                                            })}</Typography>
                                        </Grid>


                                    </Grid>

                                         <Grid container>
                                        <Grid size={4} >
                                            <Typography variant="subtitle2">Deposit provider</Typography>
                                            <Typography variant="body1" textTransform="capitalize" fontWeight="bold">{deposit?.deposit?.provider ?? '-'}</Typography>
                                        </Grid>
                      


                                    </Grid>

                                    <Divider />

                                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                                        <DepositStatus deposit={deposit?.deposit as Deposit} />
                       {deposit?.deposit?.status === 'in_review' ? (
                        <Box flexDirection="row" display="flex" columnGap="16px" >
                                             <Button onClick={() => openAlertDialog('confirm')}>
                                            Confirm Deposit
                                        </Button>
                             <Button  color="error" onClick={() => openAlertDialog('reject')}>
                                            Reject Deposit
                                        </Button>
                                        {confirmRejectDepositMtn.isPending ? <CircularProgress size={24} /> : null}

                              
                        </Box>
                       ) : null}
                          </Box>
                                </Box>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <GenericTableGenerator
                                    data={infiniteData.data ?? []}
                                    columnRender={{
                                        created_at: "datetime",
                                        amount: "amount",
                                        kind: "text",
                                        status: "text",
                                        description: "text"
                                    }}
                                    infiniteQueryResult={infiniteData}
                                    paginationModel={{
                                        page: 0,
                                        pageSize: 10,
                                    }}
                                
                                />
                            </CustomTabPanel>


                        </Box>
                    </Box>

                </Paper>

                {!loading && error && (
                    <Alert severity="error" className="my-4">
                        {errorMessage}
                    </Alert>
                )}
            </Container>
            <AlertDialog 
            message={`Are you sure you want to ${action} this deposit?`}
            title={action === 'confirm' ? "Confirm Deposit" : "Reject Deposit"}
            open={alertDialogOpen} onCancel={() => setAlertDialogOpen(false)} onConfirm={() => {
                confirmRejectDeposit()
            }} />
                  <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => {
                    setSnackbarOpen(false);
                  }}>
        <Alert
          onClose={() => {
            setSnackbarOpen(false);
          }}
          severity={snackbarAction === 'error' ? 'error' :  "success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
         {snackbarAction === 'error' ? `An error occurred while ${action}ing the deposit.` : `Deposit ${action}ed successfully.`}
        </Alert>
      </Snackbar>
            {/* Additional details can be fetched and displayed here using the useDeposit hook */}
        </div>
    );


}