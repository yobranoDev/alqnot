import React, { useContext } from "react";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ArticleContext } from "@src-contexts/ArticleProvider";

function ReportingForm({
    openReportContentForm,
    reportContent,
    setReportContent,
    reportingBasis,
    handleClearReportContent,
    setOpenReportContentForm,
    setOpenSnackbar,
}) {
    const { createFlag } = useContext(ArticleContext);
    const handleSubmitReportContent = (event) => {
        event.preventDefault();
        createFlag(reportContent);
        setOpenReportContentForm(false);
        setOpenSnackbar({
            isOpen: true,
            message: `The ${reportContent.component} has been flaged.`,
            persist: true,
        });
    };
    return (
        <Backdrop
            sx={{
                backdropFilter: " blur(2px)",
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={openReportContentForm}
        >
            <Paper
                sx={{ minWidth: 200, minHeight: 200, padding: "1rem" }}
                elevation={3}
            >
                <Stack direction="row-reverse">
                    <IconButton onClick={handleClearReportContent}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <FormControl component="form">
                    <FormLabel
                        id="reportBasisRadio"
                        sx={{ fontSize: "1.5rem" }}
                    >
                        The content contains or promotes:
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby="reportBasisRadio"
                        name="reportingBasis"
                        value={reportContent?.basis}
                        onChange={(event) => {
                            setReportContent({
                                ...reportContent,
                                basis: event.target.value,
                            });
                        }}
                        sx={{
                            pl: 3,
                        }}
                    >
                        {reportingBasis?.map(([basis, label]) => (
                            <FormControlLabel
                                key={basis}
                                value={basis}
                                control={<Radio />}
                                label={label}
                            />
                        ))}
                    </RadioGroup>
                    <Stack
                        direction="row-reverse"
                        alignItems="center"
                        spacing={1}
                    >
                        <Button
                            type="submit"
                            variant={
                                reportContent?.basis ? "contained" : "disabled"
                            }
                            onClick={(event) =>
                                handleSubmitReportContent(event)
                            }
                        >
                            Report
                        </Button>
                        <Button onClick={handleClearReportContent}>
                            Cancel
                        </Button>
                    </Stack>
                </FormControl>
            </Paper>
        </Backdrop>
    );
}

export default ReportingForm;
