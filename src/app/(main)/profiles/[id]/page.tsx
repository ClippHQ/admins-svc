
"use client";

import { Alert, Box, Button, Chip, CircularProgress, Container, Divider, Grid, Paper, Snackbar, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useActivateDeactivateUserAccount, useProfile } from "src/api/profiles";
import { VirtualAccount, WalletAccount } from "src/types";

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { format } from "date-fns";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTransactions, useVirtualAccounts, useWalletAccounts } from "src/api/transactions";
import { GenericTableGenerator } from "src/components/generic-table-generator";

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

function ProfileStatus({ status }: { status: 'active' | 'flagged'  }) {
    const color: React.ComponentProps<typeof Chip>['color'] = React.useMemo(() => {
        switch (status) {

            case 'active':
                return 'success';
            case 'flagged':
                return 'error';
            default:
                return 'default';

        }

    }, [status]);

    return (
        <Chip label={status ?? 'No Status'} color={color} />
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}





export default function ProfileDetailsPage() {
    const params = useParams();
    const [value, setValue] = React.useState(0);
    const { data: profile, status, error, refetch: refetchProfile } = useProfile({id: params?.id as string});
    const activateDeactivateUserAccountMtn = useActivateDeactivateUserAccount();
    const [action, setAction] = React.useState<'activate' | 'deactivate' | 'none'>('none')
    const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false)
    const [snackbarAction, setSnackbarAction] = React.useState<'error' | 'success' | 'none'>('none')
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const infiniteData = useTransactions({limit: 10, wallet_id: profile?.user?.wallet_id ?? ''})
    const virtualAccounts = useVirtualAccounts( profile?.user?.wallet_id ?? '')
    const walletAccounts = useWalletAccounts( profile?.user?.wallet_id ?? '')

    console.log("Profile data:", profile);


    const loading = status === 'pending'
    const errorMessage = status === 'error' ? error?.message || "An unexpected error occurred" : null;

     const address = React.useMemo(() => {
        if (!profile?.kyc_verification) return '-';
        const addressArray = [profile.kyc_verification.address_street ?? '', profile.kyc_verification.address_street_2 ?? '', profile.kyc_verification.address_city ?? '', profile.kyc_verification.address_state ?? '', profile.kyc_verification.address_zip ?? '', profile.kyc_verification.address_country ?? ''].filter(item => item.length > 0);
        console.log(addressArray, profile.kyc_verification)
        return addressArray.join(', ') ?? '-';
        
    }, [profile?.kyc_verification])

    function activateOrDeactivateProfile() { 
        setAlertDialogOpen(false);
        if (action === 'none' || !profile?.profile?.user_id) return;
        activateDeactivateUserAccountMtn.mutate({ user_id: profile?.profile?.user_id,  action: action }, {
            onError: (error) => {
                console.error("Error updating profile status:", error);
                setSnackbarAction('error');
                setSnackbarOpen(true);
            },
            onSuccess: (data) => {
                console.log("Successfully updated profile status:", data);
                setSnackbarAction('success');
                setSnackbarOpen(true);
                refetchProfile();

            }
        });

    }

    const openAlertDialog = (actionType: 'activate' | 'deactivate') => {
        setAction(actionType);
        setAlertDialogOpen(true);
    }
    return (
        <div>
            <h1>Profile Details for ID: {params?.id || 'undefined'}</h1>

            <Container>
                {loading && (
                    <div className="flex justify-center py-12">
                        <CircularProgress />
                    </div>
                )}
                <Paper style={{
                    padding: '16px'
                }}>
 

   

                    <Box marginTop="16px" display="flex" flexDirection="column" rowGap="16px">
                        <Typography variant="h4">Profile Info</Typography>

                        <Box>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Profile Details" {...a11yProps(0)} />
                                    <Tab label="Wallet Accounts" {...a11yProps(1)} />
                                    <Tab label="Virtual Accounts" {...a11yProps(2)} />
                                    <Tab label="Transaction History" {...a11yProps(3)} />


                                </Tabs>
                            </Box>

                            <CustomTabPanel value={value} index={0}>
                                <Box display="flex" flexDirection="column" rowGap="16px">
                                             <Grid container>
                            <Grid size={4} >
                                <Typography variant="subtitle2">Name</Typography>
                                <Typography textTransform="capitalize" variant="body1" fontWeight="bold">{`${profile?.profile?.name_first} ${profile?.profile?.name_last}`}</Typography>
                            </Grid>
                            <Grid size={4} >
                                <Typography variant="subtitle2">Email</Typography>
                                <Typography variant="body1" fontWeight="bold">{profile?.profile?.email}</Typography>
                            </Grid>
                            <Grid size={4} >
                                <Typography variant="subtitle2">Phone Number</Typography>
                                <Typography variant="body1" fontWeight="bold">{profile?.profile?.phone_prefix} {profile?.profile?.phone}</Typography>
                            </Grid>
                        </Grid>


                        <Grid container>
                            <Grid size={4} >
                                <Typography variant="subtitle2">Registered At</Typography>
                                <Typography variant="body1" fontWeight="bold">{format(profile?.profile?.created_at || new Date(), "dd MMM, yyyy")}</Typography>
                            </Grid>
             
                                     <Grid size={4} >
                                <Typography variant="subtitle2">Address</Typography>
                                <Typography variant="body1" fontWeight="bold">{address}</Typography>
                            </Grid>

                        </Grid>
             

                                    <Divider />


                                                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                                                            <p>{!!profile?.user?.is_flagged + 'lion'}</p>
                                                                            <ProfileStatus status={!!profile?.user?.is_flagged ? 'flagged' : 'active'} />
                                                          
                                                            <Box flexDirection="row" display="flex" columnGap="16px" >
                                                                                 <Button disabled={!profile?.user?.is_flagged} onClick={() => openAlertDialog('activate')}>
                                                                                Activate Profile
                                                                            </Button>
                                                                 <Button disabled={!!profile?.user?.is_flagged}  color="error" onClick={() => openAlertDialog('deactivate')}>
                                                                               Deactivate Profile
                                                                            </Button>
                                                                            {activateDeactivateUserAccountMtn.isPending ? <CircularProgress size={24} /> : null}
                                    
                                                                  
                                                            </Box>

                                                              </Box>

                                </Box>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>

                                <GenericTableGenerator 
                                data={walletAccounts?.data ?? [] as WalletAccount[]}
                                loading={walletAccounts?.status === 'pending'}
                                columnRender={{
                                    currency: 'text',
                                    balance_available: 'amount',
                                    balance_ledger: 'amount'
                                }}
                                
                                />
                                </CustomTabPanel>

                            <CustomTabPanel value={value} index={2}>
                                <GenericTableGenerator 
                                data={virtualAccounts?.data ?? [] as VirtualAccount[]}
                                loading={virtualAccounts?.status === 'pending'}
                                columnRender={{
                                    created_at: "datetime",
                                    account_name: 'text',
                                    account_number: 'text',
                                    bank_name: 'text',
                                    currency: 'text',
                                    provider: 'text',

                                    status: 'text',

                                }}
                                
                                />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={3}>
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
            message={`Are you sure you want to ${action} this profile?`}
            title={action === 'activate' ? "Activate Profile" : "Deactivate Profile"}
            open={alertDialogOpen} onCancel={() => setAlertDialogOpen(false)} onConfirm={() => {
                activateOrDeactivateProfile()
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
         {snackbarAction === 'error' ? `An error occurred while ${action}ing the profile.` : `Profile ${action}ed successfully.`}
        </Alert>
      </Snackbar>
            {/* Additional details can be fetched and displayed here using the useProfile hook */}
        </div>
    );


}